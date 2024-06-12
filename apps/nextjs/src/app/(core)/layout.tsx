import { Navigation } from "../../components/navigation";

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <>
      {props.children}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2">
        <Navigation />
      </div>
    </>
  );
}
