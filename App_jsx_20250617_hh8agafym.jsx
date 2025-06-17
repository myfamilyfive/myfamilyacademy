import { useState } from 'react';

export default function App() {
  const plans = [
    { name: 'Básico', price: 20 },
    { name: 'Estándar', price: 100 },
    { name: 'Premium', price: 200 },
    { name: 'VIP', price: 500 },
  ];

  const [user, setUser] = useState({
    name: 'Usuario',
    planIndex: 0,
    balance: 0,
    totalSales: 0,
    recomprasVIP: 0,
    status: 'activo',
  });

  const currentPlan = plans[user.planIndex];
  const recompraValue = currentPlan.price * 5;
  const progressPercent = ((user.balance % recompraValue) / recompraValue) * 100;

  const getRango = () => {
    if (currentPlan.price < 500) return 'Sin acceso a rangos';
    const { recomprasVIP } = user;
    if (recomprasVIP <= 0) return 'Sin rango';
    else if (recomprasVIP <= 5) return 'Baby';
    else if (recomprasVIP <= 10) return 'Brother';
    else if (recomprasVIP <= 15) return 'Father';
    else if (recomprasVIP <= 30) return 'Grandpa';
    else return 'Legacy';
  };

  const handleAddReferral = (planIndex) => {
    const referralPlan = plans[planIndex];

    if (user.status === 'bloqueado') {
      alert('⚠️ Tu cuenta está bloqueada. Las comisiones van directamente a la wallet raíz.');
      sendToRoot(referralPlan);
      return;
    }

    if (currentPlan.price < referralPlan.price) {
      alert('⚠️ No puedes vender membresías superiores a la tuya. Actualiza tu membresía.');
      return;
    }

    const commission = referralPlan.price;
    const newBalance = user.balance + commission;
    const newTotalSales = user.totalSales + commission;

    let recomprasVIP = user.recomprasVIP;
    const recompraCompleted = newBalance % recompraValue < commission;

    if (referralPlan.price === 500 && recompraCompleted) {
      recomprasVIP += 1;
      alert(`🎉 ¡Has completado una recompra VIP! Total: ${recomprasVIP}`);
    }

    setUser((prev) => ({
      ...prev,
      balance: newBalance,
      totalSales: newTotalSales,
      recomprasVIP,
    }));
  };

  const upgradePlan = () => {
    if (user.planIndex < plans.length - 1) {
      setUser((prev) => ({
        ...prev,
        planIndex: prev.planIndex + 1,
        balance: 0,
      }));
      alert('✅ Has actualizado tu membresía.');
    }
  };

  const blockUser = () => {
    setUser((prev) => ({ ...prev, status: 'bloqueado' }));
    alert('❌ Tu cuenta ha sido bloqueada por no hacer la recompra.');
  };

  const sendToRoot = (plan) => {
    console.log(`💸 Venta de ${plan.name} - $${plan.price} enviada a la cuenta raíz.`);
  };

  const rango = getRango();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <header className="text-center">
          <h1 className="text-4xl font-bold text-indigo-700">My Family Academy</h1>
          <p className="mt-2 text-gray-600">Plataforma de Educación y Comisión por Referidos</p>
        </header>

        {/* Perfil del usuario */}
        <section className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-2xl font-semibold mb-4">Tu Perfil</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Nombre</p>
              <p className="font-medium">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Membresía Actual</p>
              <p className="font-bold text-indigo-600">{currentPlan.name} (${currentPlan.price})</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Recompras VIP</p>
              <p className="font-medium">{user.recomprasVIP}</p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-500">Tu rango actual</p>
            <p className="font-bold text-xl text-green-600">{rango}</p>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-500">Ventas Acumuladas</p>
            <p className="font-medium">${user.totalSales}</p>
          </div>
        </section>

        {/* Progreso hacia próxima recompra */}
        <section className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-2xl font-semibold mb-4">Progreso hacia Recompra</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vendido: <strong>${user.balance % recompraValue}</strong> / Límite: <strong>${recompraValue}</strong>
            </label>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  progressPercent === 100 ? 'bg-red-500' : 'bg-indigo-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          <button
            onClick={upgradePlan}
            disabled={user.planIndex === plans.length - 1}
            className={`py-2 px-4 rounded-lg font-medium w-full transition-colors ${
              user.planIndex === plans.length - 1
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            Actualizar Membresía
          </button>
        </section>

        {/* Agregar referido */}
        <section className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-2xl font-semibold mb-4">Registrar Venta</h2>
          <div className="flex flex-col gap-4">
            {plans.map((plan, index) => (
              <button
                key={index}
                onClick={() => handleAddReferral(index)}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded"
              >
                Registrar Venta de {plan.name} - ${plan.price}
              </button>
            ))}
          </div>
        </section>

        {/* Botón de prueba de bloqueo */}
        <section className="text-center">
          <button
            onClick={blockUser}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded"
          >
            Simular Bloqueo por No Recompra
          </button>
        </section>

      </div>
    </div>
  );
}