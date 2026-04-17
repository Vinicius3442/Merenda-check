import { Link } from 'react-router-dom';

export default function Ouvidoria() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', fontFamily: 'Inter, sans-serif' }}>
      <header style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '16px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link to="/transparencia" style={{ color: '#64748b', textDecoration: 'none', fontSize: '1.2rem' }}>
              <i className="fa-solid fa-arrow-left"></i>
            </Link>
            <h1 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>Ouvidoria da Merenda</h1>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 600, margin: '40px auto', padding: '0 24px' }}>
        <div style={{ background: '#fff', padding: 32, borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '1.5rem' }}>Relatar um Problema</h2>
          <p style={{ color: '#64748b', marginBottom: 24 }}>Sua identidade será mantida em sigilo absoluto (Opcional). As fotos vão direto para o Auditor Municipal.</p>
          
          <form onSubmit={(e) => { e.preventDefault(); alert("Obrigado pelo seu relato. O Auditor já foi notificado."); }}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: '0.9rem' }}>Selecione a Escola</label>
              <select style={{ width: '100%', padding: '10px 14px', borderRadius: 6, border: '1px solid #cbd5e1', background: '#f8fafc' }} required>
                <option value="">Selecione...</option>
                <option value="1">CEI Pequeninos</option>
                <option value="2">EMEF João Silva</option>
                <option value="3">Outra não listada</option>
              </select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: '0.9rem' }}>Qual o problema?</label>
              <select style={{ width: '100%', padding: '10px 14px', borderRadius: 6, border: '1px solid #cbd5e1', background: '#f8fafc' }} required>
                <option value="">Selecione a categoria</option>
                <option value="falta">Falta de Merenda (Cardápio não servido)</option>
                <option value="qualidade">Comida estragada ou com aspecto ruim</option>
                <option value="quantidade">Porções muito pequenas (Pouca comida)</option>
              </select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: '0.9rem' }}>Detalhes Adicionais</label>
              <textarea rows="4" placeholder="Descreva o que aconteceu..." style={{ width: '100%', padding: '10px 14px', borderRadius: 6, border: '1px solid #cbd5e1', background: '#f8fafc', resize: 'vertical' }}></textarea>
            </div>

            <div style={{ marginBottom: 24, padding: 16, background: '#f1f5f9', border: '1px dashed #94a3b8', borderRadius: 8, textAlign: 'center', cursor: 'pointer' }}>
              <i className="fa-solid fa-camera" style={{ fontSize: '2rem', color: '#64748b', marginBottom: 8 }}></i>
              <div style={{ fontWeight: 600, color: '#334155' }}>Anexar Imagem (Opcional)</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Tire uma foto do prato ou da situação</div>
            </div>

            <button type="submit" style={{ width: '100%', padding: 16, background: '#059669', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
              Enviar Relato Anônimo
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
