'use strict';

jQuery(function ($, undefined) {

    const defaultFormData = {
        "sum": 100,
        "term": 5,
        "ic": 3718194590,
        "surname": "Petrov",
        "name": "Ivan",
        "city": "Kyiv"
    };
    const routes = {
        '/step1': ['templates/step1'],
        '/step2': ['templates/step2'],
        '/step3': ['templates/step3'],
        //'/step4': ['templates/step1', 'templates/step2'],
        // '/step5': ['templates/step1', 'templates/step2', 'templates/step3'],
    };
    var currentPath = window.location.pathname;


    /* FIRST STEP - CREATE FORM TEMPLATE */

    /* Show form-step template */
    function showStep() {
        var resultStepHtml = '';
        var templateParts = getCurrentStepTemplates();

        function getCurrentStepTemplates() {
            var resPath = routes[currentPath];

            if (!resPath) {
                currentPath = '/step1';
            }

            resPath = routes[currentPath];
            return resPath;
        }

        (function createTemplate(routesArray) {
            $.get(routesArray[0] + '.html', function (data) {
                resultStepHtml += data;

                if (routesArray.length == 1) {
                    $("#test-form").html(resultStepHtml);
                    handleTemplate();
                }
                else {
                    routesArray.shift();
                    createTemplate(routesArray);
                }
            });
        })(templateParts);
    }

    /* Getter/setter for form data */
    function getDataOfSteps() {
        var dataOfSteps = Object();

        dataOfSteps.stepNumber = parseInt(currentPath.replace('/step', ''));
        dataOfSteps.countOfSteps = parseInt(Object.keys(routes).length);

        return dataOfSteps;
    }

    function getSessionStorageData() {
        return sessionStorage.getItem('formData');
    }

    function setSessionStorageData(jsonData) {
        sessionStorage.setItem('formData', jsonData);
    }

    /* Create navigation */
    function createProgressBar() {
        var dataOfSteps = getDataOfSteps();
        var progressBarHtml = '';
        var linkStep = '';

        for (var i = 1; i <= dataOfSteps.countOfSteps; i++) {
            i <= dataOfSteps.stepNumber ? linkStep = ' progress-active' : linkStep = '';
            progressBarHtml += '<a href="/step' + i + '" class="progress-bar-step progress-bar-' + i + linkStep + '" style="width:' + 100 / dataOfSteps.countOfSteps + '%;">' + i + '</a>';
        }

        $('.progress-bar').html(progressBarHtml);
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


    /* SECOND STEP - HANDLING FORM TEMPLATE */

    /* Add initial data to form inputs */
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

        $.each(formInputsIds, function (inputId) {
            var id = formInputsIds[inputId];
            $('#' + id).val(formData[id]);
        });
    }

    /* Add onblur validation event to inputs */
    function addBlurEvent() {
        $('#test-form input[id]').on('blur', function (event) {
            inputValidation(event.target.id);
        });
    }

    function inputValidation(id) {
        var input = $('#' + id);
        var inputValue = input.val();

        function insertSuccessMark() {
            if (input.parent().find('.error').length) {
                input.parent().find('.error').remove();
                $(input).before('<span class="success-mark">&#10004;</span>');
            }
            else if (!input.parent().find('.success-mark').length) {
                $(input).before('<span class="success-mark">&#10004;</span>');
            }
        }

        function insertErrorMessage(errorText) {
            if (input.parent().find('.success-mark').length) {
                input.parent().find('.success-mark').remove();
                $(input).before('<span class="error error-mark">&#10008;</span>');
                input.parent().find('input').before('<p class="error error-text">' + errorText + '</p>');
            }
            else if (!input.parent().find('.error-mark').length) {
                $(input).before('<span class="error error-mark">&#10008;</span>');
                input.parent().find('input').before('<p class="error error-text">' + errorText + '</p>');
            }
        }

        switch (id) {
            case 'sum':
                numberBetween(1, 10000);
                break;
            case 'term':
                numberBetween(1, 12);
                break;
            case 'ic':
                ic();
                break;
            case 'surname':
                surname();
                break;
            case 'name':
                name();
                break;
            case 'city':
                city();
                break;
        }

        function numberBetween(min, max) {
            inputValue = parseInt(inputValue, 10);

            if (!isNaN(inputValue) && min <= inputValue && inputValue <= max) {
                insertSuccessMark();
            }
            else {
                insertErrorMessage('The range is from 1 to 10000.');
            }
        }

        function term() {
            console.log('term');

        }

        function ic() {
            console.log('ic');

        }

        function surname() {
            console.log('surname');

        }

        function name() {
            console.log('name');

        }

        function city() {
            console.log('city');

        }


    }

    function handleTemplate() {
        autoFill();
        addBlurEvent();
    }


    /* INITIALIZE APP */

    (function initApp() {
        showStep();
        createProgressBar();
        createNavButtons();
    })();
});