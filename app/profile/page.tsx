import AccountSection from '@/src/components/features/profile/AccountSection/AccountSection';
import NotificationSection from '@/src/components/features/profile/NotificationSection/NotificationSection';
import PersonalInfoSection from '@/src/components/features/profile/PersonalInfoSection/PersonalInfoSection';
import ProfileHeader from '@/src/components/features/profile/ProfileHeader/ProfileHeader';
import ProfileSummary from '@/src/components/features/profile/ProfileSummary/ProfileSummary';
import TestSection from '@/src/components/features/profile/TestSection/TestSection';
import BottomNavBar from '@/src/components/layout/BottomNavBar/BottomNavBar';

const ProfilePage = () => {
  return (
    <>
      <ProfileHeader />
      <div className="pt-14 pb-32">
        <ProfileSummary />
        <div className="flex flex-col gap-4 pt-9">
          <TestSection />
          <PersonalInfoSection />
          <NotificationSection />
          <AccountSection />
        </div>
      </div>

      <BottomNavBar />
    </>
  );
};

export default ProfilePage;
