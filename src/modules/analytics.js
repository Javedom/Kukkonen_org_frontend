export const logVisitToConsole = async () => {
    if (localStorage.getItem('analytics_opt_out') === 'true') {
        console.log("Lokitus estetty tältä selaimelta.");
        return; 
    }

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('ignore') === 'me') {
        localStorage.setItem('analytics_opt_out', 'true');
        alert("Omat käyntisi on nyt piilotettu tällä selaimella.");
        return;
    }

    const visitData = {
        message: "Uusi kävijä sivustolla",
        path: window.location.pathname,
        referrer: document.referrer || 'suora',
        ua: navigator.userAgent,
        screen: `${window.screen.width}x${window.screen.height}`,
        time: new Date().toISOString()
    };

    try {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

        await fetch(`${apiBaseUrl}/log`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(visitData),
            keepalive: true 
        });
    } catch (e) {
        // Hiljainen virhe
    }
};
