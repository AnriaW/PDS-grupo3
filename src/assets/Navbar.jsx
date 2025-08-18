import { Link } from "react-router-dom"

const Navbar = () => {
  return (
    <header className="w-full border-b border-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center w-full">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="w-10 h-10" />
          <h1 className="text-2xl font-bold">MeuApp</h1>
        </div>
        <nav className="space-x-4">
          <nav className="space-x-4">
            <Link to="#sobre" className="text-blue-600 hover:underline">
              Sobre
            </Link>
            <Link to="#recursos" className="text-blue-600 hover:underline">
              Recursos
            </Link>
            <Link to="#contato" className="text-blue-600 hover:underline">
              Contato
            </Link>
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
            <Link to="/register" className="text-blue-600 hover:underline">
              Registrar
            </Link>
          </nav>
        </nav>
      </div>
    </header>
  )
}

export default Navbar