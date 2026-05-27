/**
 * HealthKitPlugin.swift — FitGuard native HealthKit bridge
 *
 * Custom Capacitor plugin — no npm package needed.
 * Reads steps, active calories, exercise minutes, heart rate,
 * and weekly workout sessions directly from Apple HealthKit.
 *
 * REQUIRED (one-time in Xcode):
 *   App target → Signing & Capabilities → + Capability → HealthKit
 */

import Foundation
import Capacitor
import HealthKit

@objc(HealthKitPlugin)
public class HealthKitPlugin: CAPPlugin, CAPBridgedPlugin {

    // MARK: – Plugin registration

    public let identifier   = "HealthKitPlugin"
    public let jsName       = "HealthKit"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "authorize",       returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "readTodayData",   returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "readWeekWorkouts",returnType: CAPPluginReturnPromise),
    ]

    private let store = HKHealthStore()

    // MARK: – requestPermissions

    @objc public func authorize(_ call: CAPPluginCall) {
        guard HKHealthStore.isHealthDataAvailable() else {
            call.reject("HealthKit is not available on this device")
            return
        }

        var readSet: Set<HKObjectType> = [
            HKObjectType.workoutType(),
        ]
        let quantityIDs: [HKQuantityTypeIdentifier] = [
            .stepCount,
            .activeEnergyBurned,
            .appleExerciseTime,
            .heartRate,
        ]
        for id in quantityIDs {
            if let t = HKQuantityType.quantityType(forIdentifier: id) {
                readSet.insert(t)
            }
        }

        store.requestAuthorization(toShare: nil, read: readSet) { granted, error in
            if let err = error {
                call.reject("Authorization failed: \(err.localizedDescription)")
                return
            }
            call.resolve(["granted": granted])
        }
    }

    // MARK: – readTodayData

    @objc public func readTodayData(_ call: CAPPluginCall) {
        guard HKHealthStore.isHealthDataAvailable() else {
            call.reject("HealthKit not available")
            return
        }

        let cal   = Calendar.current
        let now   = Date()
        let start = cal.startOfDay(for: now)
        let pred  = HKQuery.predicateForSamples(
            withStart: start, end: now, options: .strictStartDate
        )

        let group = DispatchGroup()
        var steps:         Double = 0
        var calories:      Double = 0
        var activeMinutes: Double = 0
        var heartRate:     Double? = nil

        // Steps
        group.enter()
        querySum(.stepCount, unit: .count(), predicate: pred) { v in
            steps = v; group.leave()
        }

        // Active energy (kcal)
        group.enter()
        querySum(.activeEnergyBurned, unit: .kilocalorie(), predicate: pred) { v in
            calories = v; group.leave()
        }

        // Exercise time (minutes)
        group.enter()
        querySum(.appleExerciseTime, unit: .minute(), predicate: pred) { v in
            activeMinutes = v; group.leave()
        }

        // Latest heart rate (BPM)
        group.enter()
        queryLatestHR(predicate: pred) { bpm in
            heartRate = bpm; group.leave()
        }

        group.notify(queue: .main) {
            var result: [String: Any] = [
                "steps":         Int(steps),
                "calories":      Int(calories),
                "activeMinutes": Int(activeMinutes),
            ]
            if let hr = heartRate {
                result["heartRate"] = Int(hr)
            }
            call.resolve(result)
        }
    }

    // MARK: – readWeekWorkouts

    @objc public func readWeekWorkouts(_ call: CAPPluginCall) {
        guard HKHealthStore.isHealthDataAvailable() else {
            call.resolve(["workouts": [0,0,0,0,0,0,0]])
            return
        }

        // Monday of the current week
        let cal = Calendar.current
        var comps = cal.dateComponents([.yearForWeekOfYear, .weekOfYear], from: Date())
        comps.weekday = 2 // ISO Monday
        let weekStart = cal.date(from: comps) ?? Date()
        let pred = HKQuery.predicateForSamples(
            withStart: weekStart, end: Date(), options: .strictStartDate
        )

        let q = HKSampleQuery(
            sampleType: HKObjectType.workoutType(),
            predicate:  pred,
            limit:      HKObjectQueryNoLimit,
            sortDescriptors: nil
        ) { [weak self] _, samples, _ in
            guard self != nil else { return }
            var week = [0, 0, 0, 0, 0, 0, 0]  // Mon=0 … Sun=6
            if let workouts = samples as? [HKWorkout] {
                for w in workouts {
                    // weekday: Sun=1, Mon=2 … Sat=7 → convert to Mon=0 … Sun=6
                    let wd = cal.component(.weekday, from: w.startDate)
                    let idx = (wd + 5) % 7
                    if idx >= 0 && idx < 7 { week[idx] += 1 }
                }
            }
            call.resolve(["workouts": week])
        }
        store.execute(q)
    }

    // MARK: – Helpers

    private func querySum(
        _ id:        HKQuantityTypeIdentifier,
        unit:        HKUnit,
        predicate:   NSPredicate,
        completion:  @escaping (Double) -> Void
    ) {
        guard let type = HKQuantityType.quantityType(forIdentifier: id) else {
            completion(0); return
        }
        let q = HKStatisticsQuery(
            quantityType:              type,
            quantitySamplePredicate:   predicate,
            options:                   .cumulativeSum
        ) { _, stats, _ in
            completion(stats?.sumQuantity()?.doubleValue(for: unit) ?? 0)
        }
        store.execute(q)
    }

    private func queryLatestHR(
        predicate:  NSPredicate,
        completion: @escaping (Double?) -> Void
    ) {
        guard let type = HKQuantityType.quantityType(forIdentifier: .heartRate) else {
            completion(nil); return
        }
        let sort = NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: false)
        let q = HKSampleQuery(
            sampleType:      type,
            predicate:       predicate,
            limit:           1,
            sortDescriptors: [sort]
        ) { _, samples, _ in
            guard let s = samples?.first as? HKQuantitySample else {
                completion(nil); return
            }
            let bpm = s.quantity.doubleValue(
                for: HKUnit.count().unitDivided(by: .minute())
            )
            completion(bpm)
        }
        store.execute(q)
    }
}
