document.addEventListener('DOMContentLoaded', () => {
  const userData = localStorage.getItem('userData');
  if (userData) {
    showDashboard();
    updateDashboardData(JSON.parse(userData));
  } else {
    showStep(1);
  }
});

let currentStep = 1;
const totalSteps = 3;

function updateProgress() {
  const progress = (currentStep - 1) / (totalSteps - 1) * 100;
  document.getElementById('progress').style.width = `${progress}%`;
}

function showStep(step) {
  document.querySelectorAll('.step').forEach(s => s.style.display = 'none');
  document.getElementById(`step${step}`).style.display = 'block';
  currentStep = step;
  updateProgress();
}

function nextStep(step) {
  if (validateStep(step)) {
    showStep(step + 1);
  }
}

function prevStep(step) {
  showStep(step - 1);
}

function validateStep(step) {
  const form = document.getElementById(getFormId(step));
  const inputs = form.querySelectorAll('input, select');
  let isValid = true;

  inputs.forEach(input => {
    if (input.hasAttribute('required') && !input.value) {
      isValid = false;
      input.style.borderColor = '#EF4444';
    } else {
      input.style.borderColor = '#E5E7EB';
    }
  });

  if (!isValid) {
    alert('Please fill in all required fields');
  }

  return isValid;
}

function getFormId(step) {
  const forms = ['personalForm', 'businessForm', 'preferencesForm'];
  return forms[step - 1];
}

function submitOnboarding() {
  if (validateStep(3)) {
    const userData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      company: document.getElementById('company').value,
      industry: document.getElementById('industry').value,
      size: document.getElementById('size').value,
      theme: document.getElementById('theme').value,
      layout: document.getElementById('layout').value
    };

    localStorage.setItem('userData', JSON.stringify(userData));
    showDashboard();
    updateDashboardData(userData);
  }
}

function showDashboard() {
  document.getElementById('onboarding').style.display = 'none';
  document.getElementById('dashboard').style.display = 'block';
}

function updateDashboardData(userData) {
  document.getElementById('userName').textContent = userData.name;

  if (userData.theme === 'dark') {
    document.body.classList.add('dark-theme');
  }

  const ctx = document.getElementById('progressChart');
  if (ctx) {
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Completed Tasks',
          data: [2, 4, 6, 5, 7, 3, 8],
          backgroundColor: 'rgba(79, 70, 229, 0.2)',
          borderColor: '#4F46E5',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}

function logout() {
  localStorage.removeItem('userData');
  location.reload();
}
