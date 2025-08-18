const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-300 py-6 text-center text-gray-500">
      <div className="max-w-7xl mx-auto px-6">
        © {new Date().getFullYear()} MeuApp — Todos os direitos reservados.
      </div>
    </footer>
  )
}

export default Footer