import Carousel from '@/component/Carousel';
import EventListPrefer from '@/component/EventListPrefer';
import EventsNav from '@/component/EventNav';

export default function Home() {
  return (
    <div>
      <Carousel />
      <EventsNav />
      <EventListPrefer />
    </div>
  );
}
