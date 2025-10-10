import React from "react";

const services = [
    {
        id: 1,
        title: "Interactive Quizzes",
        description: "Engage with dynamic quizzes covering algebra, geometry, and more.",
        icon: "📝",
    },
    {
        id: 2,
        title: "Progress Tracking",
        description: "Track your performance and improve over time with detailed stats.",
        icon: "📊",
    },
    {
        id: 3,
        title: "Leaderboard",
        description: "Compete with friends and climb the leaderboard to show your skills.",
        icon: "🏆",
    },
];

export default function Services() {
    return (
        <section className="py-16 bg-gray-100 w-full">
            <div className="max-w-6xl mx-auto text-center px-6">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                    Our Services
                </h2>
                <p className="text-gray-600 mb-12 text-lg">
                    Everything you need to improve your math skills and have fun.
                </p>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
                        >
                            <div className="text-5xl mb-4">{service.icon}</div>
                            <h3 className="text-2xl font-semibold mb-2 text-gray-800">
                                {service.title}
                            </h3>
                            <p className="text-gray-600">{service.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
