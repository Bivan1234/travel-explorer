// Destination info for popular Indian cities
const DESTINATION_INFO = {
    'Taj Mahal': {
        description: 'The Taj Mahal, located in Agra, is an iconic symbol of India and a UNESCO World Heritage Site. Built by Mughal Emperor Shah Jahan, it is renowned for its stunning white marble architecture and romantic history.<br><br><strong>Highlights:</strong> Sunrise views, Mughal gardens, nearby Agra Fort, local cuisine, and guided tours.'
    },
    'Goa': {
        description: 'Goa is famous for its beautiful beaches, vibrant nightlife, Portuguese heritage, and delicious seafood. It is a top destination for relaxation and adventure in India.<br><br><strong>Highlights:</strong> Palolem Beach, Baga Beach, Dudhsagar Falls, spice plantations, water sports, and flea markets.'
    },
    'Jaipur': {
        description: 'Jaipur, the Pink City, is known for its royal palaces, forts, colorful bazaars, and rich Rajasthani culture. Highlights include Amber Fort, City Palace, and Hawa Mahal.<br><br><strong>Highlights:</strong> Amber Fort, Hawa Mahal, City Palace, Jantar Mantar, local handicrafts, and street food.'
    },
    'Kerala': {
        description: 'Kerala, God’s Own Country, is celebrated for its backwaters, lush greenery, hill stations, and Ayurvedic retreats. Popular spots include Munnar, Alleppey, and Kochi.<br><br><strong>Highlights:</strong> Houseboat cruises, tea plantations, wildlife sanctuaries, beaches, and traditional Kathakali performances.'
    },
    'Varanasi': {
        description: 'Varanasi is one of the world’s oldest cities, sacred to Hindus and famous for its ghats along the Ganges River, spiritual rituals, and vibrant culture.<br><br><strong>Highlights:</strong> Ganga Aarti, boat rides, Kashi Vishwanath Temple, silk weaving, and street food.'
    },
    'Mumbai': {
        description: 'Mumbai, India’s financial capital, is a bustling metropolis known for Bollywood, the Gateway of India, Marine Drive, and its cosmopolitan lifestyle.<br><br><strong>Highlights:</strong> Gateway of India, Marine Drive, Elephanta Caves, street food, and vibrant nightlife.'
    },
    'Delhi': {
        description: 'Delhi, the capital of India, blends ancient history with modern life. Key attractions include India Gate, Red Fort, Qutub Minar, and vibrant markets.<br><br><strong>Highlights:</strong> Red Fort, Qutub Minar, India Gate, Chandni Chowk, museums, and shopping.'
    },
    'Rishikesh': {
        description: 'Rishikesh, nestled in the Himalayas, is a spiritual center famous for yoga, the Ganges River, adventure sports, and scenic beauty.<br><br><strong>Highlights:</strong> Yoga retreats, river rafting, Laxman Jhula, Ganga Aarti, and trekking.'
    },
};

// Show modal with info and images
async function showDestinationModal(name) {
    const modal = document.getElementById('destination-modal');
    const title = document.getElementById('modal-title');
    const desc = document.getElementById('modal-description');
    const imagesDiv = document.getElementById('modal-images');
    title.textContent = name;
    let info = '';
    if (DESTINATION_INFO[name]) {
        info = DESTINATION_INFO[name].description;
    } else {
        info = `Discover ${name}!<br><br>This destination is known for its unique attractions, local culture, and beautiful sights.<br><br>Search online or explore travel guides for more details about ${name}.<br><br><strong>Highlights:</strong> Famous landmarks, local cuisine, cultural experiences, and scenic views.`;
    }
    desc.innerHTML = info;
    imagesDiv.innerHTML = '<p>Loading images...</p>';
    modal.style.display = 'flex';
    // Fetch more images from Unsplash
    try {
        const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(name)}&per_page=12&client_id=${UNSPLASH_ACCESS_KEY}`);
        const data = await response.json();
        imagesDiv.innerHTML = '';
        if (data.results.length === 0) {
            imagesDiv.innerHTML = '<p>No images found.</p>';
        } else {
            data.results.forEach(photo => {
                const img = document.createElement('img');
                img.src = photo.urls.small;
                img.alt = photo.alt_description || name;
                imagesDiv.appendChild(img);
            });
        }
    } catch (error) {
        imagesDiv.innerHTML = '<p>Could not load images.</p>';
    }
}

// Hide modal
function hideDestinationModal() {
    document.getElementById('destination-modal').style.display = 'none';
}
// Unsplash API and OpenWeatherMap API keys (replace with your own for production)
const UNSPLASH_ACCESS_KEY = '6hxeSzk-7X-HL96qyg25qMGzWF1-YbpCQzjjcEPu0eM'; // Unsplash API key
const OPENWEATHER_API_KEY = 'da26f1ab40eb6551c2d53b31af9fb123'; // OpenWeatherMap API key


// Fetch destination images from Unsplash based on query
async function fetchDestinations(query = 'travel') {
    const gallery = document.getElementById('destinations-gallery');
    gallery.innerHTML = '<p>Loading photos...</p>';
    try {
        const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=8&client_id=${UNSPLASH_ACCESS_KEY}`);
        const data = await response.json();
        gallery.innerHTML = '';
        if (data.results.length === 0) {
            gallery.innerHTML = '<p>No photos found for this destination.</p>';
            return;
        }
        data.results.forEach(photo => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            const img = document.createElement('img');
            img.src = photo.urls.regular;
            img.alt = photo.alt_description || 'Travel photo';
            img.title = photo.description || query;
            img.loading = 'lazy';
            // Caption: use location if available, else query
            const caption = document.createElement('div');
            caption.className = 'gallery-caption';
            caption.textContent = query;
            item.appendChild(img);
            item.appendChild(caption);
            gallery.appendChild(item);
        });
    } catch (error) {
        gallery.innerHTML = '<p>Could not load photos. Please try again later.</p>';
    }
}

// Fetch weather info from OpenWeatherMap
async function fetchWeather(city) {
    const result = document.getElementById('weather-result');
    result.textContent = 'Loading weather...';
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}&units=metric`);
        if (!response.ok) throw new Error('City not found');
        const data = await response.json();
        result.innerHTML = `<strong>${data.name}</strong>: ${data.weather[0].description}, <strong>${data.main.temp}&deg;C</strong>`;
    } catch (error) {
        result.textContent = 'Could not fetch weather. Please check the city name.';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchDestinations();
    // Gallery item click for modal
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', function() {
            const caption = this.querySelector('.gallery-caption');
            if (caption) showDestinationModal(caption.textContent.trim());
        });
    });
    // Modal close
    document.querySelector('.close-modal').addEventListener('click', hideDestinationModal);
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('destination-modal');
        if (e.target === modal) hideDestinationModal();
    });
    // Destination search form
    const destinationForm = document.getElementById('destination-form');
    if (destinationForm) {
        destinationForm.addEventListener('submit', async e => {
            e.preventDefault();
            const input = document.getElementById('destination-input');
            const query = input.value.trim();
            if (query) {
                // Show modal with info and images for searched destination
                await showDestinationModal(query);
            }
        });
    }
    // Popular India locations quick search
    document.querySelectorAll('.location-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const location = this.getAttribute('data-location');
            if (location) {
                fetchDestinations(location);
                const input = document.getElementById('destination-input');
                if (input) input.value = location;
            }
        });
    });
    // Weather form
    document.getElementById('weather-form').addEventListener('submit', e => {
        e.preventDefault();
        const city = document.getElementById('city-input').value.trim();
        if (city) fetchWeather(city);
    });
    // Smooth scroll for nav links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.hash) {
                e.preventDefault();
                document.querySelector(this.hash).scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});
