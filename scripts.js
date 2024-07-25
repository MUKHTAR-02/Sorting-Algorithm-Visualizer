document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Load theme from local storage if available
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        themeToggle.checked = true;
    }

    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    });
});

// Your existing JavaScript functions go here...


let array = [];
let size = 20;

function initializeArray() {
    if (array.length === 0) {
        array = Array.from({length: size}, (_, i) => i + 1);
    }
}

function setArray() {
    const input = document.getElementById('array-input').value;
    array = input.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
    size = array.length;
    renderBars();
}

function renderBars() {
    const barsContainer = document.getElementById('bars');
    barsContainer.innerHTML = '';
    array.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = `${value * 10}px`;
        bar.style.backgroundColor = index % 2 === 0 ? 'steelblue' : 'orange'; 
        barsContainer.appendChild(bar);
    });
}

async function bubbleSort() {
    const start = performance.now();
    for (let i = 0; i < size - 1; i++) {
        for (let j = 0; j < size - i - 1; j++) {
            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                renderBars();
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
    }
    const end = performance.now();
    displayTime('Bubble Sort', end - start);
}

async function insertionSort() {
    const start = performance.now();
    for (let i = 1; i < size; i++) {
        let key = array[i];
        let j = i - 1;
        while (j >= 0 && array[j] > key) {
            array[j + 1] = array[j];
            j--;
            renderBars();
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        array[j + 1] = key;
        renderBars();
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    const end = performance.now();
    displayTime('Insertion Sort', end - start);
}

async function selectionSort() {
    const start = performance.now();
    for (let i = 0; i < size - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < size; j++) {
            if (array[j] < array[minIndex]) {
                minIndex = j;
            }
        }
        if (minIndex !== i) {
            [array[i], array[minIndex]] = [array[minIndex], array[i]];
            renderBars();
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
    const end = performance.now();
    displayTime('Selection Sort', end - start);
}

async function mergeSort(arr = array) {
    if (arr.length <= 1) return arr;

    const middle = Math.floor(arr.length / 2);
    const left = arr.slice(0, middle);
    const right = arr.slice(middle);

    return merge(await mergeSort(left), await mergeSort(right));
}

async function merge(left, right) {
    let result = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
        if (left[leftIndex] < right[rightIndex]) {
            result.push(left[leftIndex]);
            leftIndex++;
        } else {
            result.push(right[rightIndex]);
            rightIndex++;
        }
    }
    result = result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
    array = result;
    renderBars();
    await new Promise(resolve => setTimeout(resolve, 100));
    return result;
}

async function quickSort(arr = array, low = 0, high = arr.length - 1) {
    if (low < high) {
        let pivotIndex = await partition(arr, low, high);
        await quickSort(arr, low, pivotIndex - 1);
        await quickSort(arr, pivotIndex + 1, high);
    }
}

async function partition(arr, low, high) {
    let pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
            renderBars();
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    renderBars();
    await new Promise(resolve => setTimeout(resolve, 100));
    return i + 1;
}

function changeSize() {
    const newSize = parseInt(document.getElementById('array-size').value);
    if (newSize >= 5 && newSize <= 100) {
        size = newSize;
        resetArray();
    }
}

function resetArray() {
    initializeArray();
    renderBars();
}

function displayTime(sortName, time) {
    const seconds = (time / 1000).toFixed(2);
    const timeFormatted = `${seconds} seconds`;
    
    const timeDisplay = document.getElementById('time-display');
    timeDisplay.innerHTML = `${sortName} took ${timeFormatted}.`;
}

async function startSort(sortType) {
    initializeArray();
    document.getElementById('algorithm-name');
    renderBars();
    const start = performance.now();
    switch (sortType) {
        case 'bubble':
            await bubbleSort();
            break;
        case 'insertion':
            await insertionSort();
            break;
        case 'selection':
            await selectionSort();
            break;
        case 'merge':
            await mergeSort();
            break;
        case 'quick':
            await quickSort();
            break;
    }
    const end = performance.now();
    displayTime(`${sortType.charAt(0).toUpperCase() + sortType.slice(1)} Sort`, end - start);
}
