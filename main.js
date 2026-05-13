import * as XLSX from 'xlsx';

document.addEventListener('DOMContentLoaded', () => {
  const searchContainer = document.getElementById('search-container');
  const nametagContainer = document.getElementById('nametag-container');
  const empInput = document.getElementById('emp-number');
  const searchBtn = document.getElementById('search-btn');
  const backBtn = document.getElementById('back-btn');
  const errorMsg = document.getElementById('error-msg');
  
  // Elements to update
  const elCourseName = document.getElementById('course-name');
  const elCoursePeriod = document.getElementById('course-period');
  const elDepartment = document.getElementById('department');
  const elName = document.getElementById('name');

  let excelData = null;
  let isDataLoading = false;

  // Preload Excel Data
  async function loadExcelData() {
    try {
      isDataLoading = true;
      const response = await fetch('/data.xlsx');
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });
      
      excelData = json;
      isDataLoading = false;
    } catch (error) {
      console.error('Failed to load excel data:', error);
      errorMsg.textContent = '데이터를 불러오는데 실패했습니다.';
      isDataLoading = false;
    }
  }

  // Initial load
  loadExcelData();

  function showLoading() {
    const loadingEl = document.createElement('div');
    loadingEl.className = 'loading';
    loadingEl.innerHTML = '<div class="spinner"></div><p>검색 중...</p>';
    document.getElementById('app').appendChild(loadingEl);
    return loadingEl;
  }

  async function handleSearch() {
    const query = empInput.value.trim();
    if (!query) {
      errorMsg.textContent = '사번을 입력해주세요.';
      return;
    }

    if (!excelData) {
      if (isDataLoading) {
        errorMsg.textContent = '데이터를 불러오는 중입니다. 잠시 후 다시 시도해주세요.';
      } else {
        errorMsg.textContent = '데이터를 불러올 수 없습니다.';
      }
      return;
    }

    errorMsg.textContent = '';
    const loading = showLoading();

    // Small delay for UI smoothness
    await new Promise(r => setTimeout(r, 400));

    // New structure (Array of arrays)
    // Row 2 (Index 1) Index 1 is Course Name
    let courseName = (excelData[1] && excelData[1][1]) || '';
    let coursePeriod = '';

    // Find user by 사번 (Index 4 in data rows)
    let foundUser = null;
    
    // Data starts at index 3
    for (let i = 3; i < excelData.length; i++) {
      const row = excelData[i];
      if (row[4] && String(row[4]) === query) {
        foundUser = {
          department: row[1] || '',
          name: row[2] || '',
          period: row[3] || ''
        };
        break;
      }
    }

    loading.remove();

    if (foundUser) {
      // Format Period
      let rawDate = foundUser.period;
      let formattedPeriod = rawDate;
      if (typeof rawDate === 'string' && rawDate.includes('/')) {
        let parts = rawDate.split('/');
        if (parts.length === 3) {
          let m = parts[0].padStart(2, '0');
          let d = parts[1].padStart(2, '0');
          let y = parts[2];
          y = y.length === 2 ? '20' + y : y;
          formattedPeriod = `${y}-${m}-${d}`;
        }
      }

      // Update UI
      elCourseName.textContent = courseName;
      elCoursePeriod.textContent = formattedPeriod;
      elDepartment.textContent = foundUser.department;
      elName.textContent = foundUser.name;

      // Switch view
      searchContainer.classList.remove('active');
      nametagContainer.classList.add('active');
    } else {
      errorMsg.textContent = '해당 사번을 찾을 수 없습니다.';
    }
  }

  searchBtn.addEventListener('click', handleSearch);
  
  empInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  });

  backBtn.addEventListener('click', () => {
    empInput.value = '';
    nametagContainer.classList.remove('active');
    searchContainer.classList.add('active');
  });
});
