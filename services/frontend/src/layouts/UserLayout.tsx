import { Outlet } from 'react-router';
import { UserSidebar } from '../components/UserSidebar/UserSidebar';
import { useIsMobile } from '../hooks/useIsMobile';
import { BackButton } from '../components/BackButton/BackButton';

export const UserLayout = () => {
  const isMobile = useIsMobile();
  return (
    <>
      <main className="flex h-full w-full flex-col bg-white md:flex-row">
        {isMobile ? <BackButton link="/dashboard" /> : <UserSidebar />}
        <section className="flex-1 overflow-y-auto">
          <Outlet />
        </section>
      </main>
    </>
  );
};
