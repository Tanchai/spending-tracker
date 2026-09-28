import { isSupabaseConfigured } from './lib/supabase'
import { Dashboard } from './components/Dashboard'
import './App.css'

export default function App() {
  // Public, no-login board: just render the tracker immediately.
  if (!isSupabaseConfigured()) {
    return <SetupNotice />
  }
  return <Dashboard />
}

function SetupNotice() {
  return (
    <div className="center-pad setup-card">
      <h1>almost ready ♡</h1>
      <p>this shared tracker needs ~2 lil things before it can run:</p>
      <ol>
        <li>Create a <strong>free Supabase project</strong> at supabase.com</li>
        <li>Copy the <code>SUPABASE_URL</code> and <code>ANON_KEY</code> into a file named <code>.env.local</code></li>
      </ol>
      <p>once that's in, this page becomes our board — you & bae ♡</p>
    </div>
  )
}