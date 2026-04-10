import BgMesh from '../ui/BgMesh';
import Sidebar from './Sidebar';
import Footer from '../ui/Footer';

export default function DashboardLayout({ children }) {
  return (
    <>
      <BgMesh />
      <div className="app-container">
        <Sidebar />
        <main className="app-main">
          {children}
          <Footer />
        </main>
      </div>
    </>
  );
}
