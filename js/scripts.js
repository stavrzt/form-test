'use strict';

jQuery(function ($, undefined) {

    const defaultFormData = {
        "sum": 100,
        "term": 5,
        "IC": 3718194590,
        "surname": "Petrov",
        "name": "Ivan",
        "city": "Kyiv"
    };

    const routes = {
        '/step1': ['templates/step1'],
        '/step2': ['templates/step2'],
        '/step3': ['templates/step1', 'templates/step2', 'templates/step3'],
        // '/step4': ['templates/step1', 'templates/step2', 'templates/step3'],
        // '/step5': ['templates/step1', 'templates/step2', 'templates/step3'],
        // '/step6': ['templates/step1', 'templates/step2', 'templates/step3'],
    };

    var currentPath = window.location.pathname;

    function getCurrentStepTemplates() {
        var resPath = routes[currentPath];

        if (!resPath) {
            currentPath = '/step1';
        }

        resPath = routes[currentPath];
        return resPath;
    }

    function showStep() {
        var resultStepHtml = '';
        var templateParts = getCurrentStepTemplates();

        (function createTemplate(routesArray) {
            $.get(routesArray[0] + '.html', function (data) {
                resultStepHtml += data;

                if (routesArray.length == 1) {
                    $("#test-form").html(resultStepHtml);
                    autoFill();
                }
                else {
                    routesArray.shift();
                    createTemplate(routesArray);
                }
            });
        })(templateParts);
    }

    function getDataOfSteps() {
        var dataOfSteps = Object();

        dataOfSteps.stepNumber = parseInt(currentPath.replace('/step', ''));
        dataOfSteps.countOfSteps = parseInt(Object.keys(routes).length);

        return dataOfSteps;
    }

    function createProgressBar() {
        var dataOfSteps = getDataOfSteps();
        var progressBarHtml = '';
        var linkStep = '';

        for (var i = 1; i <= dataOfSteps.countOfSteps; i++) {
            i <= dataOfSteps.stepNumber ? linkStep = ' progress-active' : linkStep = '';
            progressBarHtml += '<a href="/step' + i + '" class="progress-bar-step progress-bar-' + i + linkStep + '" style="width:' + 100 / dataOfSteps.countOfSteps + '%;">' + i + '</a>';
        }

        $(".progress-bar").html(progressBarHtml);
    }

    function createNavButtons() {
        var dataOfSteps = getDataOfSteps();
        var progressNavHtml = '';

        switch (dataOfSteps.stepNumber) {
            case 1:
                progressNavHtml = '<a href="/step2" class="next btn btn-default pull-right">Вперед</a>';
                break;
            case dataOfSteps.countOfSteps:
                progressNavHtml = '<a href="/step' + (dataOfSteps.countOfSteps - 1) + '" class="prev btn btn-default pull-left">Назад</a>';
                break;
            default:
                progressNavHtml = '<a href="/step' + (dataOfSteps.stepNumber - 1) + '" class="prev btn btn-default pull-left">Назад</a>';
                progressNavHtml += '<a href="/step' + (dataOfSteps.stepNumber + 1) + '" class="next btn btn-default pull-right">Вперед</a>';
        }

        $(".switch-buttons").html(progressNavHtml);
    }

    function getSessionStorageData() {
        return sessionStorage.getItem('formData');
    }

    function setSessionStorageData(jsonData) {
        sessionStorage.setItem('formData', jsonData);
    }

    function autoFill() {
        //get form inputs id's
        var formInputs = $('#test-form input[id]');
        var formInputsIds = formInputs.map(function () {
            return this.id;
        }).get();

        var formData = getSessionStorageData();

        if (formData) {
            formData = JSON.parse(formData);
        }
        else {
            setSessionStorageData(JSON.stringify(defaultFormData));
            formData = defaultFormData;
        }

        console.log(formData);

        console.log(formInputsIds);

        // $.each(formInputsIds, function (inputId) {
        //     $('#' + inputId).value = formData[inputId];
        // })
    }

    function initApp() {
        showStep();
        createProgressBar();
        createNavButtons();
    }


    $(document).ready(function () {
        initApp();
    });

});