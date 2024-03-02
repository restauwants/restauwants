export function BottomBar(props: { children: React.ReactNode }) {
  return (
    <div
      className={`fixed bottom-4 grid w-full auto-cols-fr grid-flow-col items-center justify-items-center gap-4`}
    >
      {props.children}
    </div>
  );
}
