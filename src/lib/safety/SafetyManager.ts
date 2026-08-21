export class SafetyManager {
  /**
   * Instantly closes the app and clears the session.
   * Redirects to a neutral site like Google.
   */
  static quickExit(): void {
    // Clear all session storage / local storage
    if (typeof window !== "undefined") {
      window.sessionStorage.clear();
      window.localStorage.clear();
      // Replace history to prevent going back
      window.location.replace("https://www.google.com");
    }
  }

  /**
   * Shows a calculator interface instead of the app.
   */
  static disguiseApp(setDisguiseMode: (mode: boolean) => void): void {
    setDisguiseMode(true);
    if (typeof window !== "undefined") {
      // Could also set a flag in session storage
      window.sessionStorage.setItem("disguise", "true");
    }
  }

  /**
   * Emergency SOS sequence.
   * Gets location, could send alerts to backend, and shows safety steps.
   */
  static async emergencySOS(): Promise<void> {
    if (typeof navigator !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };
          console.log("Emergency SOS Triggered at Location:", location);
          // TODO: Send silent alert to backend with location
        },
        (error) => {
          console.error("SOS Location error:", error);
          // TODO: Send silent alert without location
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      console.log("Emergency SOS Triggered (Location not supported)");
      // TODO: Send silent alert without location
    }
  }
}
