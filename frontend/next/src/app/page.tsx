import Link from "next/link";

const steps = [
  {
    title: "Créez votre compte",
    description:
      "Inscrivez-vous en quelques minutes avec vos informations personnelles et universitaires.",
  },
  {
    title: "Soumettez votre candidature",
    description:
      "Remplissez le formulaire guidé pas à pas et soumettez votre dossier de stage en ligne.",
  },
  {
    title: "Suivez votre dossier",
    description:
      "Consultez en temps réel l'avancement de votre candidature et son statut.",
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="bg-steg py-20 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight md:text-5xl">
            Candidature aux stages STEG en ligne
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-blue-100">
            La plateforme officielle de candidature aux stages de la Société Tunisienne de
            l’Électricité et du Gaz. Postulez, suivez votre dossier et restez informé.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/register"
              className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-steg transition hover:bg-blue-50"
            >
              Commencer ma candidature
            </Link>
            <Link
              href="/login"
              className="rounded-md border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-2xl font-bold text-foreground">
            Comment ça marche ?
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.title} className="card">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-steg text-white">
                  {i + 1}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-card py-16">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-2xl font-bold">Prêt à postuler ?</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            Rejoignez les nombreux candidats et démarrez votre parcours de stage au sein de la STEG.
          </p>
          <Link href="/register" className="btn-primary mt-6">
            Créer mon compte candidat
          </Link>
        </div>
      </section>
    </div>
  );
}
