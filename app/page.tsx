import SiteEntry from '../frontend/components/landing/SiteEntry';
import { getChatGPTUser } from '../backend/auth/chatgpt-auth';
export default async function Home() {
  const user = await getChatGPTUser();
  return <SiteEntry runtime="chatgpt" initialUser={user ? { id: user.userId, name: user.displayName, email: user.email } : null} />;
}
