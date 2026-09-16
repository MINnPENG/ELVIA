export default function AboutPage() {
  return (
    <div className='flex w-full justify-center bg-gray-500/20'>
      <video
        className='h-auto w-[90%]'
        src='/company_description.mp4'
        autoPlay
        loop
        muted
        playsInline
      />
    </div>
  );
}
