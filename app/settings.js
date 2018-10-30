$(document).ready(function () {
    $("#enableExtensionCheckbox").prop("checked", localStorage["enableExtension"] === "true");
    $("#unwantedLanguagePicker").val(localStorage["unwantedLanguage"]);
    $("#preferedLanguagePicker").val(localStorage["preferedLanguage"]);

    updateFormEnabled($("#enableExtensionCheckbox")[0].checked);

    // Handle enable/disable checkbox
    $('#enableExtensionCheckbox').on('change', function (e) {
        var enabled = $("#enableExtensionCheckbox")[0].checked;
        localStorage["enableExtension"] = enabled;

        updateFormEnabled(enabled);
    });

    // Handle save button click
    $("#saveButton").click(function () {
        try {
            var unwanted = $('#unwantedLanguagePicker').val();
            var prefered = $('#preferedLanguagePicker').val();

            if (unwanted === "" || prefered === "") {
                $("#success-warning").fadeTo(2000, 500).slideUp(500, function () {
                    $("#success-warning").slideUp(500);
                });
                
                return;
            }

            localStorage["unwantedLanguage"] = unwanted;
            localStorage["preferedLanguage"] = prefered;

            $("#success-alert").fadeTo(2000, 500).slideUp(500, function () {
                $("#success-alert").slideUp(500);
            });
        }
        catch (exception)
        {
            $("#success-error").fadeTo(2000, 500).slideUp(500, function () {
                $("#success-error").slideUp(500);
            });
        }
    });

    // Handle Open Settings on popup page
    $("#openSettingsLink").click(function () {
        if (chrome.runtime.openOptionsPage) {
            chrome.runtime.openOptionsPage();
        } else {
            window.open(chrome.runtime.getURL('app/settings.html'));
        }
    });

    var urlParams = new URLSearchParams(location.search);

    if (urlParams.has("firstTime")) {
        AnnoButton.prototype.buttonElem = function (anno) {
            return $("<button class='anno-btn'></button>").html(this.textFn(anno)).addClass(this.className).click((function (_this) {
                return function (evt) {
                    evt.preventDefault(); //<--Stop event from bubbling up to elements it shouldn't be fiddling with
                    return _this.click.call(anno, anno, evt);
                };
            })(this));
        };

        var anno1 = new Anno([{
            target: '#unwantedLanguagePicker',
            content: 'Enter the <strong>unwanted</strong> language here, i.e.: nl-nl',
            position: 'top'
        },
        {
            target: '#preferedLanguagePicker',
            content: 'Enter the <strong>preferred</strong> language here, i.e.: en-us',
            position: 'top'
        },
        {
            target: '#saveButton',
            content: 'Click save to persist the new settings',
            position: 'bottom'
        },
        {
            target: '#toolbarIcon',
            content: 'You can also quick-access the settings through the icon here when on the Docs pages',
            position: 'bottom'
        }]);

        anno1.show();
    }
});

function updateFormEnabled(enabled) {
    $("#preferedLanguagePicker").prop('disabled', !enabled);
    $("#unwantedLanguagePicker").prop('disabled', !enabled);
}