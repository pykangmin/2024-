var probabilities = [
    { fortune: "초대길", probability: 0.01 },
    { fortune: "대길", probability: 0.08 },
    { fortune: "길", probability: 0.14 },
    { fortune: "소길", probability: 0.22 },
    { fortune: "평범", probability: 0.33 },
    { fortune: "소흉", probability: 0.11 },
    { fortune: "흉", probability: 0.07 },
    { fortune: "대흉", probability: 0.04 }
];

var fortunes = probabilities.map(p => p.fortune);
var slots = ['', '', ''];
var selectedCategories = []; // 사용자가 선택한 카테고리를 저장하기 위한 배열

function spinSlot(index, selectedFortune) {
    var counter = 0;
    var interval = setInterval(function() {
        var slotElements = document.getElementById('slots').children;
        slotElements[index].textContent = fortunes[counter % fortunes.length];
        counter++;

        if (counter > 20 + fortunes.indexOf(selectedFortune)) {
            clearInterval(interval);
            slotElements[index].textContent = selectedFortune;
        }
    }, 100);
}

document.addEventListener('DOMContentLoaded', function() {
    var interestButtons = document.querySelectorAll('.interest-button');
    interestButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            if (selectedCategories.length < 3 || btn.classList.contains('selected')) {
                btn.classList.toggle('selected');
                var category = btn.textContent;
                var index = selectedCategories.indexOf(category);
                if (index > -1) {
                    selectedCategories.splice(index, 1);
                } else {
                    selectedCategories.push(category);
                }
            }
            // 새로고침 버튼을 제외한 다른 버튼의 활성화/비활성화 상태 갱신
            updateButtonStates();
        });
    });

    // 새로고침 버튼 로직 추가 (아이디 'refreshButton' 가정)
    var refreshButton = document.getElementById('refreshButton');
    refreshButton.addEventListener('click', resetSelection);

    // 초기 버튼 상태 설정
    updateButtonStates();
});

function updateButtonStates() {
    var interestButtons = document.querySelectorAll('.interest-button');
    var selectedCount = selectedCategories.length;

    interestButtons.forEach(function(btn) {
        btn.disabled = selectedCount >= 3 && !btn.classList.contains('selected');
    });
}

function getRandomFortune() {
    
    var randomNum = Math.random();
    var sum = 0;
    for (var i = 0; i < probabilities.length; i++) {
        sum += probabilities[i].probability;
        if (randomNum <= sum) {
            return probabilities[i].fortune;
        }
    }
    return probabilities[probabilities.length - 1].fortune;
}

function showFortunes() {
    var name = document.getElementById('name').value;
    var age = document.getElementById('age').value;
    var fortuneButton = document.querySelector('button');
    var interestButtons = document.querySelectorAll('.interest-button');

    if (name.trim() === "" || age.trim() === "") {
        alert("이름과 나이를 모두 입력해주세요.");
        return;
    }

    fortuneButton.disabled = true;
    interestButtons.forEach(function(btn) {
        btn.disabled = true;
    });

    for (var i = 0; i < 3; i++) {
        slots[i] = getRandomFortune();
        spinSlot(i, slots[i]);
    }

    setTimeout(function() {
        var resultMessage = name + "님의 2024 한 해 운세는 다음과 같습니다:\n";
        for (var i = 0; i < slots.length; i++) {
            var category = selectedCategories[i] || "카테고리 미선택";
            resultMessage += category + " : " + slots[i] + "\n";
        }

        // 트리플 메시지 조건 처리
        var isTriple = (slots[0] === slots[1] && slots[1] === slots[2]);
        if (isTriple) {
            resultMessage += slots[0] + " 트리플!!!\n";
        }

        // 추가 메시지 조건 처리
        if (slots.every(val => val === "초대길")) {
            resultMessage += "말도 안되는 기적의 확률!! 2024년 모든 일에 행운이 따르고 하는 일, 원하는 것마다 다 잘되길 바랍니다. 추가로 나오셨으면 사진 찍어서 인증 부탁드립니다!! 저도 뜬 적이 없어요 ㅋㅋㅋㅋ\n";
        } else if (slots.every(val => val === "대흉")) {
            resultMessage += "나름 초대박 3개 다음으로 희귀한 확률인데 '운'이 좋으시네요! 그 운이 행운일지 불운일지는 잘 모르겠네요? '나를 죽이지 못하는 고통은, 나를 더 강하게 해줄 뿐이다.' -니체- 파이팅입니다!\n";
        } else if (slots.every(val => val === "소흉" || val === "흉" || val === "대흉")) {
            resultMessage += "운이 없는 당신!! 이번 한 해 조심하고 시련을 극복하는 인간승리의 삶을 살길 바랍니다\n";
        } else if (slots.every(val => val === "소길" || val === "길" || val === "대길" || val === "초대길")) {
            resultMessage += "2024년 청룡의 해 용과 같이 하늘을 비상하는 좋은 일만 가득하길 바랍니다\n";
        } else if (name.startsWith('6')) {
            resultMessage += "우리 양육팀 함께 해서 즐거웠고 여러분 같은 사람의 부팀장이여서 정말 행복했습니다. 결과가 어떻든지 간에 새해 복 많이 받고 행운만이 가득하길 소망합니다.\n";
        } else if (name.includes('MIJ')) {
            resultMessage += "같이 청소년 2부 사역하느라 즐거웠고, 2024년도 잘 부탁드립니다!!\n";
        } else if (name.includes('교무')) {
            resultMessage += "2023년 함께 사역해서 즐거웠고, 고마웠습니다. 2024년도 잘 부탁드립니다~~\n";
        } else if (name.includes('C')) {
            resultMessage += "2023년 함께 채플하고 많은 추억 가운데 그리스도인으로 함께 있던 순간들이 행복이였습니다. 2024년 행운이 함께하길 바래요~\n";
        }

        alert(resultMessage);

        var selectedCount = document.querySelectorAll('.interest-button.selected').length;
        interestButtons.forEach(function(btn) {
            btn.disabled = selectedCount >= 3 && !btn.classList.contains('selected');
        });

        var buttons = document.querySelectorAll('.interest-button');
        for (var i = 0; i < selectedCategories.length; i++) {
            var category = selectedCategories[i];
            var fortune = slots[i];

            // 버튼을 찾아서 색상 클래스 적용
            buttons.forEach(function(btn) {
                if (btn.textContent.trim() === category) {
                    var fortuneClasses = ['대흉', '흉', '소흉', '대길', '길', '소길'];
                    fortuneClasses.forEach(function(fortuneClass) {
                        btn.classList.remove('fortune-' + fortuneClass);
                    });
                    btn.classList.add('fortune-' + fortune);
                }
            });
        }

        fortuneButton.disabled = false;
        interestButtons.forEach(function(btn) {
            btn.disabled = false;
        });
    }, (20 + Math.max(...fortunes.map(f => fortunes.indexOf(f)))) * 100);
}

function resetSelection() {
    selectedCategories = []; // 선택된 카테고리 초기화
    var interestButtons = document.querySelectorAll('.interest-button');
    interestButtons.forEach(function(btn) {
        btn.classList.remove('selected'); // 'selected' 클래스 제거
    });
    var fortuneClasses = ['대흉', '흉', '소흉', '대길', '길', '소길'];
    interestButtons.forEach(function(btn) {
        fortuneClasses.forEach(function(fortune) {
            btn.classList.remove('fortune-' + fortune);
        });
    });
}