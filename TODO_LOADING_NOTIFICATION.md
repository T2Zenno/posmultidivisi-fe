# Loading Modal to Notification Popup - Implementation

## Plan yang Disetujui:
- Ganti loading modal dengan small notification popup di kanan bawah
- Hapus full-screen overlay yang mengurangi opacity dashboard
- Dashboard content tetap fully interactive selama loading

## Progress:
- [x] Create new LoadingToast component using existing toast system
- [x] Modify Dashboard.tsx to use LoadingToast instead of LoadingDialog
- [x] Remove loading overlay that dims dashboard content
- [x] Update toast positioning to appear on right bottom
- [ ] Test the loading behavior

## Status: IN PROGRESS
