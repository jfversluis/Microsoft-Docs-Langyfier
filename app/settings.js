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
            window.open(chrome.runtime.getURL('settings.html'));
        }
    });
});

function updateFormEnabled(enabled) {
    $("#preferedLanguagePicker").prop('disabled', !enabled);
    $("#unwantedLanguagePicker").prop('disabled', !enabled);
}