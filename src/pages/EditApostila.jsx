import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import { apostilaAPI } from '../services/api';

export default function EditApostila({ htmlText }) {
  const location = useLocation();
  const initialHTML = htmlText ?? location.state?.htmlText ?? '';
  const apostilaId = location.state?.id;

  const [html, setHtml] = useState(initialHTML);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage('');

      await apostilaAPI.updateEditedApostila(apostilaId, html);

      setMessage('Changes saved successfully!');
    } catch (err) {
      console.error(err);
      setMessage('Error saving changes.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        <h1 className="text-3xl font-semibold mb-6">Editar Apostila</h1>

        <textarea
          className="w-full h-[36rem] border border-gray-300 rounded-lg p-4 font-mono text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={html}
          onChange={(e) => setHtml(e.target.value)}
        />

        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg disabled:opacity-50 transition"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>

          {message && (
            <span
              className={`text-sm ${message.includes('Error') ? 'text-red-500' : 'text-green-600'
                }`}
            >
              {message}
            </span>
          )}
        </div>
      </main>
    </div>
  );
}
