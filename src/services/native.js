/**
 * native.js — Capacitor plugin bridge
 * All native device features go through here so the web fallback stays clean.
 */
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

export const isNative = Capacitor.isNativePlatform();

// ─── Status Bar ───────────────────────────────────────────────────────────────
export async function initStatusBar() {
  if (!isNative) return;
  try {
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: '#0A0A0F' });
  } catch (e) {
    console.warn('StatusBar init failed:', e);
  }
}

// ─── Splash Screen ────────────────────────────────────────────────────────────
export async function hideSplash() {
  if (!isNative) return;
  try {
    await SplashScreen.hide({ fadeOutDuration: 300 });
  } catch (e) {
    console.warn('SplashScreen hide failed:', e);
  }
}

// ─── Camera ───────────────────────────────────────────────────────────────────
export async function requestCameraPermission() {
  if (!isNative) return 'granted'; // browser handles its own permissions
  try {
    const perms = await Camera.requestPermissions({ permissions: ['camera'] });
    return perms.camera; // 'granted' | 'denied' | 'limited'
  } catch (e) {
    console.warn('Camera permission request failed:', e);
    return 'denied';
  }
}

export async function takeCameraPhoto() {
  try {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      quality: 80,
      allowEditing: false,
      saveToGallery: false,
    });
    return photo.dataUrl;
  } catch (e) {
    if (e?.message?.includes('cancelled') || e?.message?.includes('canceled')) return null;
    throw e;
  }
}

// ─── Haptics ──────────────────────────────────────────────────────────────────
export async function hapticLight() {
  if (!isNative) return;
  try { await Haptics.impact({ style: ImpactStyle.Light }); } catch (_) {}
}

export async function hapticMedium() {
  if (!isNative) return;
  try { await Haptics.impact({ style: ImpactStyle.Medium }); } catch (_) {}
}

export async function hapticHeavy() {
  if (!isNative) return;
  try { await Haptics.impact({ style: ImpactStyle.Heavy }); } catch (_) {}
}

export async function hapticSuccess() {
  if (!isNative) return;
  try { await Haptics.notification({ type: NotificationType.Success }); } catch (_) {}
}

export async function hapticWarning() {
  if (!isNative) return;
  try { await Haptics.notification({ type: NotificationType.Warning }); } catch (_) {}
}

export async function hapticError() {
  if (!isNative) return;
  try { await Haptics.notification({ type: NotificationType.Error }); } catch (_) {}
}

export async function hapticSelectionStart() {
  if (!isNative) return;
  try { await Haptics.selectionStart(); } catch (_) {}
}

export async function hapticSelectionChanged() {
  if (!isNative) return;
  try { await Haptics.selectionChanged(); } catch (_) {}
}

export async function hapticSelectionEnd() {
  if (!isNative) return;
  try { await Haptics.selectionEnd(); } catch (_) {}
}
