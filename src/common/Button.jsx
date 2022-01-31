import "./Button.css";

const Button = (props) => {
  const { className, text, onClick, disabled } = props;

  return (
    <button className={className} onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
};

export default Button;
