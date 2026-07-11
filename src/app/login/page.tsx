import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-amber-50 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="mb-1 text-center text-2xl font-bold text-slate-800">
          📚 Flashcards
        </h1>
        <p className="mb-6 text-center text-sm text-slate-500">
          Entra con tu usuario para estudiar
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
