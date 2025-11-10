import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, ArrowRight, Sparkles, Workflow, FlaskConical } from "lucide-react";
import { Link } from "wouter";

export default function Services() {
  const services = [
    {
      id: "test-plans",
      icon: Sparkles,
      title: "Test de Plans",
      subtitle: "Validation visuelle avant tournage",
      description: "Générez des plans de test par IA avant le tournage pour valider vos idées visuelles et économiser du temps et des ressources. Parfait pour les pré-visualisations et les présentations clients.",
      price: "Sur devis",
      features: [
        "Génération rapide de plans de test",
        "Itérations illimitées jusqu'à validation",
        "Export haute résolution",
        "Validation visuelle immédiate",
        "Présentation client professionnelle",
        "Ajustements en temps réel"
      ],
      benefits: [
        "Économisez du temps et des coûts de production",
        "Validez vos concepts avant l'investissement",
        "Présentez des visuels convaincants aux clients",
        "Réduisez les risques créatifs"
      ],
      color: "primary",
      gradient: "from-green-900/20 to-green-950/40"
    },
    {
      id: "workflow-complet",
      icon: Workflow,
      title: "Workflow Complet",
      subtitle: "Du storyboard à la vidéo finale",
      description: "Solution clé en main qui couvre l'intégralité du processus de création vidéo par IA. De la réception du storyboard client à la livraison de la vidéo finale avec post-production complète.",
      price: "Sur devis",
      features: [
        "Analyse du storyboard client",
        "Entraînement de modèles Lora personnalisés",
        "Workflow de restylisation sur mesure",
        "Animation complète des séquences",
        "Choix et intégration des voix",
        "Post-production et finalisation",
        "Livraison multi-formats"
      ],
      benefits: [
        "Processus complet sans intermédiaire",
        "Qualité professionnelle garantie",
        "Respect des délais convenus",
        "Support dédié tout au long du projet"
      ],
      color: "secondary",
      gradient: "from-blue-900/20 to-blue-950/40"
    },
    {
      id: "rd-specifique",
      icon: FlaskConical,
      title: "R&D Spécifique",
      subtitle: "Solutions innovantes sur mesure",
      description: "Développement de solutions personnalisées pour vos projets uniques nécessitant recherche et développement. Nous créons des workflows et outils spécifiques adaptés à vos besoins particuliers.",
      price: "Sur devis",
      features: [
        "Recherche et développement sur mesure",
        "Création de workflows personnalisés",
        "Développement d'outils dédiés",
        "Formation à l'utilisation",
        "Support technique dédié",
        "Documentation complète",
        "Maintenance et évolutions"
      ],
      benefits: [
        "Solutions uniques adaptées à vos besoins",
        "Innovation technologique",
        "Avantage compétitif",
        "Propriété intellectuelle protégée"
      ],
      color: "accent",
      gradient: "from-orange-900/20 to-orange-950/40"
    }
  ];

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold cursor-pointer hover:text-primary transition-colors">
              Jenia
            </h1>
          </Link>
          <nav className="flex gap-6">
            <Link href="/">
              <a className="hover:text-primary transition-colors">Accueil</a>
            </Link>
            <Link href="/services">
              <a className="text-primary font-semibold">Services</a>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Nos Services</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Des solutions complètes de conception vidéo par intelligence artificielle, 
            adaptées à vos besoins et à votre budget
          </p>
        </div>
      </section>

      {/* Services détaillés */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="container mx-auto space-y-24">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
              >
                {/* Image/Icon side */}
                <div className="flex-1">
                  <Card className={`p-12 bg-gradient-to-br ${service.gradient} border-2 border-${service.color} relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-${service.color}/10 rounded-full blur-3xl" />
                    <Icon className={`h-32 w-32 text-${service.color} mx-auto relative z-10`} />
                  </Card>
                </div>

                {/* Content side */}
                <div className="flex-1 space-y-6">
                  <div>
                    <h2 className="text-4xl font-bold mb-2">{service.title}</h2>
                    <p className={`text-xl text-${service.color} mb-4`}>{service.subtitle}</p>
                    <p className="text-gray-400 text-lg leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold mb-4">Inclus dans cette formule</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {service.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <Check className={`h-5 w-5 text-${service.color} flex-shrink-0 mt-0.5`} />
                          <span className="text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold mb-4">Avantages</h3>
                    <ul className="space-y-2">
                      {service.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <ArrowRight className={`h-5 w-5 text-${service.color} flex-shrink-0 mt-0.5`} />
                          <span className="text-gray-300">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4">
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-3xl font-bold">{service.price}</span>
                    </div>
                    <Button
                      size="lg"
                      className={`bg-${service.color} hover:bg-${service.color}/90 text-${service.color}-foreground w-full md:w-auto`}
                      onClick={scrollToContact}
                    >
                      Demander un devis
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Processus Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Comment ça marche ?</h2>
          <p className="text-xl text-center text-gray-400 mb-16 max-w-3xl mx-auto">
            Notre processus en 6 étapes pour transformer votre vision en réalité
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                step: "01",
                title: "Storyboard Client",
                description: "Réception et analyse de votre storyboard pour comprendre votre vision créative."
              },
              {
                step: "02",
                title: "Entraînement Lora",
                description: "Entraînement de modèles personnalisés avec vos données : styles, références visuelles."
              },
              {
                step: "03",
                title: "Workflow de Restylisation",
                description: "Conception d'un workflow sur mesure pour styliser vos images selon vos besoins."
              },
              {
                step: "04",
                title: "Validation Client",
                description: "Présentation des résultats et ajustements selon vos retours."
              },
              {
                step: "05",
                title: "Animation",
                description: "Animation des images stylisées pour créer des séquences vidéo fluides."
              },
              {
                step: "06",
                title: "Post-production",
                description: "Choix des voix, sound design, et finalisation complète de la vidéo."
              }
            ].map((item, index) => (
              <Card key={index} className="p-6 bg-gray-800 border border-gray-700 hover:border-primary transition-colors">
                <div className="text-5xl font-bold text-primary/20 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-black">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">Prêt à démarrer votre projet ?</h2>
          <p className="text-xl text-gray-400 mb-12">
            Contactez-nous pour discuter de vos besoins et obtenir un devis personnalisé
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Demander un devis
            </Button>
            <Link href="/">
              <Button size="lg" variant="outline">
                Voir nos démos
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-black border-t border-gray-800">
        <div className="container mx-auto text-center text-gray-500">
          <p>&copy; 2025 Jenia. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
