/**
 * CustomBridgeViewController.swift — FitGuard Capacitor bridge
 *
 * Subclass CAPBridgeViewController so we can register in-project plugins
 * that are NOT picked up by CAPBridgedPlugin auto-discovery (which only
 * works for SPM package plugins in Capacitor 5+).
 *
 * Referenced by Main.storyboard as the root view controller class.
 */

import Capacitor

class CustomBridgeViewController: CAPBridgeViewController {

    override open func capacitorDidLoad() {
        // Register our native HealthKit plugin with the Capacitor bridge.
        // This is the correct Capacitor 5+ API for in-project plugins.
        bridge?.registerPluginInstance(HealthKitPlugin())
    }
}
