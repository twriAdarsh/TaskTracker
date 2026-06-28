/**
 * Button — Generic, fully reusable button component.
 *
 * Props:
 *  - variant    : 'primary' | 'secondary' | 'danger' | 'ghost'  (default: 'primary')
 *  - size       : 'sm' | 'md' | 'lg'                            (default: 'md')
 *  - loading    : boolean — shows spinner and disables button
 *  - icon       : React node — optional leading icon
 *  - fullWidth  : boolean
 *  - ...rest    : all native <button> props (onClick, type, disabled, etc.)
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon = null,
  fullWidth = false,
  className = '',
  disabled,
  type = 'button',
  ...rest
}) => {
  return (
    <button
      type={type}
      className={`btn btn--${variant} btn--${size} ${fullWidth ? 'btn--full' : ''} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <span className="btn__spinner" aria-hidden="true" />
      ) : (
        icon && <span className="btn__icon">{icon}</span>
      )}
      {children}
    </button>
  );
};

export default Button;
