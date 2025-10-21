import { Link } from 'react-router-dom';

const CriarApostila = () => {

    return  (
    <div className="text-center mb-12">
      <Link
      to="/create-new"
      className="inline-block bg-blue-600 text-white text-lg font-semibold py-4 px-8 rounded-lg hover:bg-blue-500 transition shadow-md"
      >
        ✚ Criar Nova Apostila
      </Link>
    </div>
  )
}

export default CriarApostila