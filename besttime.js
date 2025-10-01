
const DESTINATION_DETAILS = {
    'Taj Mahal': {
        about: 'The Taj Mahal is a UNESCO World Heritage Site in Agra, India. Built by Mughal emperor Shah Jahan in memory of his wife Mumtaz Mahal, it is one of the Seven Wonders of the World.',
        bestTime: 'October to March',
        attractions: ['Agra Fort', 'Mehtab Bagh', 'Fatehpur Sikri'],
        note: 'Entry fee: ₹50 (Indians), ₹1100 (Foreigners). Open: Sunrise to Sunset (closed Fridays).'
    },
    'Goa': {
        about: 'Goa is famous for its beautiful beaches, vibrant nightlife, Portuguese heritage, and delicious seafood. It is a top destination for relaxation and adventure in India.',
        bestTime: 'November to February',
        attractions: ['Palolem Beach', 'Dudhsagar Falls', 'Baga Beach'],
        note: 'Famous for beaches, nightlife, and water sports.'
    },
    'Jaipur': {
        about: 'Jaipur, the Pink City, is known for its royal palaces, forts, colorful bazaars, and rich Rajasthani culture.',
        bestTime: 'October to March',
        attractions: ['Amber Fort', 'Hawa Mahal', 'City Palace'],
        note: 'Known as the Pink City, rich in history and architecture.'
    },
    'Kerala': {
        about: 'Kerala, God’s Own Country, is celebrated for its backwaters, lush greenery, hill stations, and Ayurvedic retreats.',
        bestTime: 'September to March',
        attractions: ['Munnar', 'Alleppey', 'Kochi'],
        note: 'Enjoy houseboats, tea plantations, and backwaters.'
    },
    'Varanasi': {
        about: 'Varanasi is one of the world’s oldest cities, sacred to Hindus and famous for its ghats along the Ganges River, spiritual rituals, and vibrant culture.',
        bestTime: 'October to March',
        attractions: ['Ganga Ghats', 'Kashi Vishwanath Temple', 'Sarnath'],
        note: 'Spiritual city, famous for Ganga Aarti and temples.'
    },
    'Mumbai': {
        about: 'Mumbai, India’s financial capital, is a bustling metropolis known for Bollywood, the Gateway of India, Marine Drive, and its cosmopolitan lifestyle.',
        bestTime: 'November to February',
        attractions: ['Gateway of India', 'Marine Drive', 'Elephanta Caves'],
        note: 'Financial capital, vibrant nightlife, and street food.'
    },
    'Delhi': {
        about: 'Delhi, the capital of India, blends ancient history with modern life. Key attractions include India Gate, Red Fort, Qutub Minar, and vibrant markets.',
        bestTime: 'October to March',
        attractions: ['Red Fort', 'Qutub Minar', 'India Gate'],
        note: 'Blend of ancient history and modern life.'
    },
    'Rishikesh': {
        about: 'Rishikesh, nestled in the Himalayas, is a spiritual center famous for yoga, the Ganges River, adventure sports, and scenic beauty.',
        bestTime: 'September to November',
        attractions: ['Laxman Jhula', 'Triveni Ghat', 'Neelkanth Mahadev Temple'],
        note: 'Yoga capital, river rafting, and scenic beauty.'
    }
};

async function fetchPlaceDetails(place) {
    if (DESTINATION_DETAILS[place]) {
        return DESTINATION_DETAILS[place];
    }
    // Fallback: Use Wikipedia API for summary
    let summary = '';
    let bestTime = '';
    try {
        const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(place + ', India')}`);
        const data = await res.json();
        summary = data.extract || 'No details found.';
        // Try to extract best time to visit from summary text
        const bestTimeMatch = summary.match(/best time to visit (?:is|are|would be|ranges from)?\s*([^.]+)\./i);
        if (bestTimeMatch && bestTimeMatch[1]) {
            bestTime = bestTimeMatch[1].trim();
        } else {
            // Try to find month names in the summary
            const months = summary.match(/(January|February|March|April|May|June|July|August|September|October|November|December)/gi);
            if (months && months.length > 0) {
                bestTime = [...new Set(months)].join(', ');
            } else {
                bestTime = 'October, November, December, January, February, March (most destinations in India)';
            }
        }
    } catch {
        summary = 'No details found.';
        bestTime = 'October, November, December, January, February, March (most destinations in India)';
    }
    return {
        about: summary,
        bestTime,
        attractions: [
            'Famous attractions may include UNESCO World Heritage sites, ancient temples, forts, palaces, scenic lakes, national parks, and vibrant markets.',
            'For specific recommendations, explore travel guides or tourism websites for the destination.'
        ],
        note: 'Entry requirements may include valid ID, travel permits, or advance booking. Ticket fees can range from free entry to premium charges for foreigners. Opening hours are typically from sunrise to sunset, but may vary for specific sites. Travel tips: Check for local holidays, dress codes (especially for temples), and safety advisories. For the latest and most accurate information, visit the official tourism website of the destination or consult trusted travel resources.'
    };
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('search-form');
    const input = document.getElementById('search-input');
    const result = document.getElementById('search-result');
    if (form) {
        form.addEventListener('submit', async e => {
            e.preventDefault();
            const place = input.value.trim();
            if (place) {
                result.innerHTML = '<div class="result">Loading...</div>';
                const details = await fetchPlaceDetails(place);
                result.innerHTML = `<div class='result'>
                    <h2>${place}</h2>
                    <h3>About</h3>
                    <div>${details.about}</div>
                    <h3>Best time to visit</h3>
                    <div>${details.bestTime}</div>
                    <h3>Nearby attractions</h3>
                    <ul>${details.attractions.map(a => `<li>${a}</li>`).join('')}</ul>
                    <h3>Extra Note</h3>
                    <div>${details.note}</div>
                </div>`;
            } else {
                result.textContent = '';
            }
        });
    }
});
