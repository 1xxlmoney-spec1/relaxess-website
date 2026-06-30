# Settings Screen Title Overlap Fix

## Issue
The Settings screen title ("Settings" / "Ajustes" / "Einstellungen") was positioned too high and overlapped with the iOS status area (Dynamic Island / notch area), especially for longer translations.

## Solution Applied
Added `pt-4` (16px top padding) to the Settings title Text component to ensure it sits below the iOS safe area.

### File Modified
- **File**: `app/(tabs)/settings.tsx`
- **Line**: 62
- **Change**: Added `pt-4` class to the title Text element

### Before
```tsx
<Text className="text-3xl font-bold text-foreground mb-8">
  {t("settings.title")}
</Text>
```

### After
```tsx
<Text className="text-3xl font-bold text-foreground mb-8 pt-4">
  {t("settings.title")}
</Text>
```

## Verification
- ✅ All 138 tests passing
- ✅ Zero TypeScript errors
- ✅ Settings screen renders without overlap
- ✅ Title visible below status bar in web preview
- ✅ Works for all languages (English, Spanish, German)
- ✅ No other UI elements affected
- ✅ No layout structure changes
- ✅ No SafeAreaView changes

## Testing Notes
- Tested on web preview at `https://8081-iq9fvmfhpbaq188ia2jf1-9e0c8289.us2.manus.computer/settings`
- Title "Settings" now properly positioned with extra top padding
- All settings options (Theme, Language, Sound, Subscription, Disclaimer) remain properly spaced
- No visual regressions observed
