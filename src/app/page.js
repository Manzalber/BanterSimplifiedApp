import Phonecall from '@/components/Phonecall'; // Assuming alias is configured for the components directory

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Phonecall />
    </main>
  );
}