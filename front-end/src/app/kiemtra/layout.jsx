// app/kiemtra/layout.js
import { KiemtraProvider } from '~/context/KiemtraContext';

export default function KiemtraLayout({ children }) {
  return (
    <KiemtraProvider>
    <div>
      <main>{children}</main>
    </div>
  </KiemtraProvider>
  );
}
