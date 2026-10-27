import SiteEntry from '../../frontend/components/landing/SiteEntry';
import { getChatGPTUser } from '../../backend/auth/chatgpt-auth';
export const metadata = { title: 'Đăng nhập — SYNERA' };
export default async function Login() {
  const user = await getChatGPTUser();
  return <SiteEntry runtime="chatgpt" initialPage="login" initialUser={user ? { id: user.userId, name: user.displayName, email: user.email } : null} />;
}
