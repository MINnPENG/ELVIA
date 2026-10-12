import LoginForm from './LoginForm';

export default function AdminLoginPage() {
  return (
    <div className='flex flex-col items-center gap-6 px-4 py-20'>
      <h1 className='text-2xl font-bold'>관리자 로그인</h1>
      <LoginForm />
    </div>
  );
}
