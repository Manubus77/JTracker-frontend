const Loader = ({ message = 'Loading...' }) => (
  <div className="loader">
    <div className="spinner" aria-hidden />
    <span>{message}</span>
  </div>
)

export default Loader

