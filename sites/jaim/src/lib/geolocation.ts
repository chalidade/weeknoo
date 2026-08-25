// Cross-platform "where am I" — in the APK navigator.geolocation never gets a
// runtime permission prompt (the WebView just auto-denies), so on native we go
// through the Capacitor Geolocation plugin, which owns the Android permission
// dialog. When the user has permanently denied the permission (or location
// services are off) the only way out is the system settings screen — callers
// get a `settings` hint so they can render an "open settings" button.
import { Capacitor } from '@capacitor/core'
import { Geolocation } from '@capacitor/geolocation'
import { AndroidSettings, IOSSettings, NativeSettings } from 'capacitor-native-settings'

export interface GeoResult {
  latitude: number
  longitude: number
}

export type GeoSettingsTarget = 'app' | 'location'

export class GeoError extends Error {
  /** Which settings screen would fix it, if any. Only meaningful on native. */
  settings: GeoSettingsTarget | null

  constructor(message: string, settings: GeoSettingsTarget | null = null) {
    super(message)
    this.settings = settings
  }
}

export const isNativeApp = Capacitor.isNativePlatform()

async function getNativeCoords(): Promise<GeoResult> {
  let status
  try {
    status = await Geolocation.checkPermissions()
  } catch {
    // checkPermissions throws when location services are disabled entirely
    throw new GeoError('Layanan lokasi (GPS) sedang mati.', 'location')
  }

  if (status.location !== 'granted') {
    const alreadyDenied = status.location === 'denied'
    const req = await Geolocation.requestPermissions().catch(() => null)
    if (!req || req.location !== 'granted') {
      // denied before AND after the request = Android no longer shows the
      // dialog ("don't ask again") — only the app settings screen can undo it
      throw new GeoError(
        alreadyDenied
          ? 'Izin lokasi diblokir — aktifkan lewat pengaturan aplikasi.'
          : 'Izin lokasi ditolak.',
        alreadyDenied ? 'app' : null,
      )
    }
  }

  try {
    const pos = await Geolocation.getCurrentPosition({
      enableHighAccuracy: false,
      timeout: 15000,
      maximumAge: 60000,
    })
    return { latitude: pos.coords.latitude, longitude: pos.coords.longitude }
  } catch {
    throw new GeoError('Gagal membaca lokasi — pastikan GPS aktif.', 'location')
  }
}

function getWebCoords(): Promise<GeoResult> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new GeoError('Browser ini tidak mendukung geolokasi.'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      (err) =>
        reject(
          new GeoError(
            err.code === err.PERMISSION_DENIED
              ? 'Izin lokasi ditolak — izinkan akses lokasi untuk situs ini di pengaturan browser.'
              : 'Gagal membaca lokasi.',
          ),
        ),
      { timeout: 15000, maximumAge: 60000 },
    )
  })
}

export function getCurrentCoords(): Promise<GeoResult> {
  return isNativeApp ? getNativeCoords() : getWebCoords()
}

/** Open the system screen where the user can grant what was denied. */
export async function openGeoSettings(target: GeoSettingsTarget): Promise<void> {
  await NativeSettings.open({
    optionAndroid:
      target === 'location' ? AndroidSettings.Location : AndroidSettings.ApplicationDetails,
    optionIOS: target === 'location' ? IOSSettings.LocationServices : IOSSettings.App,
  })
}
