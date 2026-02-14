import { useState, useEffect } from 'react';
import { auth, db } from '@/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { collection, addDoc, getDocs, doc, serverTimestamp } from 'firebase/firestore';

export function FirebaseTest() {
  const [status, setStatus] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const addLog = (message, type = 'info') => {
    setStatus(prev => [...prev, { message, type, time: new Date().toLocaleTimeString() }]);
  };

  useEffect(() => {
    addLog('Inicializando pruebas de Firebase...', 'info');
    
    // Verificar que Firebase esté configurado
    if (import.meta.env.VITE_FIREBASE_API_KEY) {
      addLog('✓ Variables de entorno cargadas correctamente', 'success');
    } else {
      addLog('✗ Error: Variables de entorno no encontradas', 'error');
    }

    // Escuchar cambios de autenticación
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        addLog(`✓ Usuario autenticado: ${currentUser.email}`, 'success');
      } else {
        addLog('Usuario no autenticado', 'warning');
      }
    });

    return () => unsubscribe();
  }, []);

  const testAuth = async () => {
    setLoading(true);
    try {
      addLog('Intentando autenticación con Google...', 'info');
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      addLog(`✓ Autenticación exitosa: ${result.user.email}`, 'success');
    } catch (error) {
      addLog(`✗ Error de autenticación: ${error.message}`, 'error');
      console.error('Auth error:', error);
    }
    setLoading(false);
  };

  const testFirestore = async () => {
    if (!user) {
      addLog('✗ Error: Debes iniciar sesión primero', 'error');
      return;
    }

    setLoading(true);
    try {
      addLog('Probando conexión a Firestore...', 'info');
      
      // Crear documento de prueba
      const testRef = collection(doc(db, 'users', user.uid), 'tests');
      const docRef = await addDoc(testRef, {
        message: 'Test de conexión',
        timestamp: serverTimestamp(),
        userAgent: navigator.userAgent
      });
      
      addLog(`✓ Documento creado: ${docRef.id}`, 'success');

      // Leer documentos
      const snapshot = await getDocs(testRef);
      addLog(`✓ Documentos leídos: ${snapshot.size}`, 'success');

    } catch (error) {
      addLog(`✗ Error de Firestore: ${error.message}`, 'error');
      console.error('Firestore error:', error);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      addLog('✓ Sesión cerrada correctamente', 'success');
    } catch (error) {
      addLog(`✗ Error al cerrar sesión: ${error.message}`, 'error');
    }
  };

  const clearLogs = () => {
    setStatus([]);
    addLog('Logs limpiados', 'info');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center">Firebase Connection Test</h1>
        
        {/* Estado del usuario */}
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <h2 className="text-lg font-semibold mb-2">Estado de Autenticación</h2>
          {user ? (
            <div className="space-y-2">
              <p className="text-green-400">✓ Autenticado</p>
              <p className="text-gray-400">Email: {user.email}</p>
              <p className="text-gray-400">UID: {user.uid}</p>
            </div>
          ) : (
            <p className="text-yellow-400">No autenticado</p>
          )}
        </div>

        {/* Botones de acción */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={testAuth}
            disabled={loading || user}
            className="py-4 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 
                       rounded-xl font-semibold active:scale-95 transition-transform"
          >
            {loading ? 'Cargando...' : 'Test Auth Google'}
          </button>
          
          <button
            onClick={testFirestore}
            disabled={loading || !user}
            className="py-4 px-6 bg-green-600 hover:bg-green-700 disabled:bg-gray-800 
                       rounded-xl font-semibold active:scale-95 transition-transform"
          >
            {loading ? 'Cargando...' : 'Test Firestore'}
          </button>
          
          <button
            onClick={handleLogout}
            disabled={!user}
            className="py-4 px-6 bg-red-600 hover:bg-red-700 disabled:bg-gray-800 
                       rounded-xl font-semibold active:scale-95 transition-transform"
          >
            Cerrar Sesión
          </button>
          
          <button
            onClick={clearLogs}
            className="py-4 px-6 bg-gray-700 hover:bg-gray-600 rounded-xl 
                       font-semibold active:scale-95 transition-transform"
          >
            Limpiar Logs
          </button>
        </div>

        {/* Logs */}
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <h2 className="text-lg font-semibold mb-4">Logs de Prueba</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {status.length === 0 ? (
              <p className="text-gray-500 italic">No hay logs aún...</p>
            ) : (
              status.map((log, index) => (
                <div 
                  key={index} 
                  className={`text-sm font-mono p-2 rounded ${
                    log.type === 'success' ? 'bg-green-900/30 text-green-400' :
                    log.type === 'error' ? 'bg-red-900/30 text-red-400' :
                    log.type === 'warning' ? 'bg-yellow-900/30 text-yellow-400' :
                    'bg-gray-800 text-gray-300'
                  }`}
                >
                  <span className="text-gray-500">[{log.time}]</span> {log.message}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Instrucciones */}
        <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800 text-sm text-gray-400">
          <h3 className="font-semibold text-gray-300 mb-2">Instrucciones:</h3>
          <ol className="list-decimal list-inside space-y-1">
            <li>Haz clic en &quot;Test Auth Google&quot; para iniciar sesión</li>
            <li>Una vez autenticado, haz clic en &quot;Test Firestore&quot;</li>
            <li>Verifica que no haya errores en la consola del navegador (F12)</li>
            <li>Si todo funciona, elimina esta ruta de prueba</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
