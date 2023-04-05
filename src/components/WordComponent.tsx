type TWordProps = {
  idx: string;
  word: string;
};

export default function WordComponent(props: TWordProps) {
  return (
    <span id={props.idx.toString()} key={props.idx}>
      {props.word}{" "}
    </span>
  );
}
