export default function FooterSection({
  id,
  title,
  children,
  as: Component = "section",
  className = "lg:col-span-3",
}) {
  return (
    <Component className={className} aria-labelledby={id}>
      <h2 id={id} className="footer-heading">
        {title}
      </h2>
      {children}
    </Component>
  );
}
