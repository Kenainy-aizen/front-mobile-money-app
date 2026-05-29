/**
 * Validation des numéros de téléphone malgaches
 * Format: 03X XX XXX XX (commence par 03, 10 chiffres)
 */
export const validatePhone = (numtel) => {
  if (!numtel || numtel.trim() === "") {
    return "Le numéro de téléphone est requis";
  }
  const cleaned = numtel.replace(/\s/g, "");
  if (!/^03\d{8}$/.test(cleaned)) {
    return "Format invalide. Doit commencer par 03 et contenir 10 chiffres (ex: 0345556634)";
  }
  return null; // null = pas d'erreur
};

/**
 * Validation du nom
 */
export const validateName = (nom) => {
  if (!nom || nom.trim() === "") {
    return "Le nom est requis";
  }
  if (nom.trim().length < 2) {
    return "Le nom doit contenir au moins 2 caractères";
  }
  if (nom.trim().length > 50) {
    return "Le nom est trop long (max 50 caractères)";
  }
  if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(nom.trim())) {
    return "Le nom ne doit contenir que des lettres et des espaces";
  }
  return null;
};

/**
 * Validation de l'âge
 */
export const validateAge = (age) => {
  if (age === "" || age === null || age === undefined) {
    return "L'âge est requis";
  }
  const numAge = Number(age);
  if (isNaN(numAge) || !Number.isInteger(numAge)) {
    return "L'âge doit être un nombre entier";
  }
  if (numAge < 1) {
    return "L'âge doit être supérieur à 0";
  }
  if (numAge > 150) {
    return "L'âge semble invalide (max 150)";
  }
  return null;
};

/**
 * Validation du solde / montant
 * @param {*} value - La valeur à valider
 * @param {string} fieldName - Nom du champ pour le message d'erreur
 * @param {object} options - Options de validation
 * @param {number} options.min - Valeur minimale (défaut: 0)
 * @param {number} options.max - Valeur maximale
 * @param {boolean} options.allowZero - Autoriser zéro (défaut: true)
 */
export const validatePositiveAmount = (
  value,
  fieldName = "Le montant",
  options = {},
) => {
  const { min = 0, max, allowZero = true } = options;

  if (value === "" || value === null || value === undefined) {
    return `${fieldName} est requis`;
  }
  const num = Number(value);
  if (isNaN(num)) {
    return `${fieldName} doit être un nombre valide`;
  }
  if (!Number.isFinite(num)) {
    return `${fieldName} est invalide`;
  }
  if (num < min) {
    if (min === 0) {
      return `${fieldName} ne peut pas être négatif`;
    }
    return `${fieldName} doit être supérieur à ${min - 1}`;
  }
  if (!allowZero && num === 0) {
    return `${fieldName} doit être supérieur à 0`;
  }
  if (max !== undefined && num > max) {
    return `${fieldName} est trop grand (max ${max.toLocaleString("fr-FR")} Ar)`;
  }
  return null;
};

/**
 * Validation email
 */
export const validateEmail = (mail) => {
  if (!mail || mail.trim() === "") {
    return "L'email est requis";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(mail.trim())) {
    return "Format d'email invalide (ex: nom@domaine.com)";
  }
  if (mail.trim().length > 100) {
    return "L'email est trop long (max 100 caractères)";
  }
  return null;
};

/**
 * Validation du sexe
 */
export const validateSexe = (sexe) => {
  if (!sexe) {
    return "Le sexe est requis";
  }
  const valeurs = ["Masculin", "Féminin"];
  if (!valeurs.includes(sexe)) {
    return "Veuillez choisir un sexe valide";
  }
  return null;
};

/**
 * Validation de la raison (optionnelle)
 * Autorise lettres, chiffres, espaces et ponctuation française de base
 */
export const validateRaison = (raison) => {
  if (!raison || raison.trim() === "") {
    return null; // optionnel
  }
  if (raison.trim().length > 200) {
    return "La raison est trop longue (max 200 caractères)";
  }
  if (/[<>{}$%()=+\[\]\\^`~]/.test(raison)) {
    return "La raison contient des caractères non autorisés";
  }
  return null;
};

/**
 * Validation du numéro de récepteur (doit être différent de l'envoyeur)
 */
export const validateRecepteur = (numtel, envoyeurnumtel) => {
  const phoneErr = validatePhone(numtel);
  if (phoneErr) return phoneErr;
  if (numtel.replace(/\s/g, "") === envoyeurnumtel.replace(/\s/g, "")) {
    return "Le récepteur doit être différent de l'envoyeur";
  }
  return null;
};

// ============================================================
// Validateurs de formulaires complets
// ============================================================

/**
 * Valide le formulaire Client (ajout / modification)
 * Retourne un objet { nom, numtel, age, solde, mail, sexe }
 * où chaque valeur est null (pas d'erreur) ou un message d'erreur.
 */
export const validateClientForm = (formData) => {
  return {
    nom: validateName(formData.nom),
    numtel: validatePhone(formData.numtel),
    age: validateAge(formData.age),
    solde: validatePositiveAmount(formData.solde, "Le solde", {
      max: 1_000_000_000,
    }),
    mail: validateEmail(formData.mail),
    sexe: validateSexe(formData.sexe),
  };
};

/**
 * Valide le formulaire Envoi
 * Retourne un objet { numEnvoyeur, numRecepteur, montant, raison }
 */
export const validateEnvoiForm = (formData) => {
  return {
    numEnvoyeur: validatePhone(formData.numEnvoyeur),
    numRecepteur: validateRecepteur(
      formData.numRecepteur,
      formData.numEnvoyeur,
    ),
    montant: validatePositiveAmount(formData.montant, "Le montant", {
      min: 1,
      max: 100_000_000,
      allowZero: false,
    }),
    raison: validateRaison(formData.raison),
  };
};

/**
 * Valide le formulaire Retrait
 * Retourne un objet { numtel, montant, raison }
 */
export const validateRetraitForm = (formData) => {
  return {
    numtel: validatePhone(formData.numtel),
    montant: validatePositiveAmount(formData.montant, "Le montant", {
      min: 1,
      max: 100_000_000,
      allowZero: false,
    }),
    raison: validateRaison(formData.raison),
  };
};

/**
 * Valide le formulaire Frais Envoi
 * Retourne un objet { montant1, montant2, frais_env }
 */
export const validateFraisEnvoiForm = (formData) => {
  const errMontant1 = validatePositiveAmount(formData.montant1, "Montant min", {
    min: 0,
    max: 1_000_000_000,
  });
  const errMontant2 = validatePositiveAmount(formData.montant2, "Montant max", {
    min: 0,
    max: 1_000_000_000,
  });
  const errFrais = validatePositiveAmount(formData.frais_env, "Les frais", {
    min: 0,
    max: 10_000_000,
  });

  let errRange = null;
  const m1 = Number(formData.montant1);
  const m2 = Number(formData.montant2);
  if (
    !errMontant1 &&
    !errMontant2 &&
    formData.montant1 !== "" &&
    formData.montant2 !== "" &&
    !isNaN(m1) &&
    !isNaN(m2) &&
    m2 <= m1
  ) {
    errRange = "Le montant max doit être supérieur au montant min";
  }

  return {
    montant1: errMontant1,
    montant2: errMontant2 || errRange,
    frais_env: errFrais,
  };
};

/**
 * Valide le formulaire Frais Retrait
 * Retourne un objet { montant1, montant2, frais_rec }
 */
export const validateFraisRetraitForm = (formData) => {
  const errMontant1 = validatePositiveAmount(formData.montant1, "Montant min", {
    min: 0,
    max: 1_000_000_000,
  });
  const errMontant2 = validatePositiveAmount(formData.montant2, "Montant max", {
    min: 0,
    max: 1_000_000_000,
  });
  const errFrais = validatePositiveAmount(formData.frais_rec, "Les frais", {
    min: 0,
    max: 10_000_000,
  });

  let errRange = null;
  const m1 = Number(formData.montant1);
  const m2 = Number(formData.montant2);
  if (
    !errMontant1 &&
    !errMontant2 &&
    formData.montant1 !== "" &&
    formData.montant2 !== "" &&
    !isNaN(m1) &&
    !isNaN(m2) &&
    m2 <= m1
  ) {
    errRange = "Le montant max doit être supérieur au montant min";
  }

  return {
    montant1: errMontant1,
    montant2: errMontant2 || errRange,
    frais_rec: errFrais,
  };
};

/**
 * Valide le formulaire Relevé Client
 * Retourne un objet { numTel, month, year }
 */
export const validateReleveForm = (formData) => {
  const errPhone = validatePhone(formData.numTel);
  let errMonth = null;
  const m = Number(formData.month);
  if (formData.month === "" || isNaN(m)) {
    errMonth = "Le mois est requis";
  } else if (m < 1 || m > 12) {
    errMonth = "Le mois doit être entre 1 et 12";
  }
  let errYear = null;
  const y = Number(formData.year);
  if (formData.year === "" || isNaN(y)) {
    errYear = "L'année est requise";
  } else if (!Number.isInteger(y)) {
    errYear = "L'année doit être un nombre entier";
  } else if (y < 2000 || y > 2100) {
    errYear = "L'année doit être entre 2000 et 2100";
  }
  return {
    numTel: errPhone,
    month: errMonth,
    year: errYear,
  };
};

/**
 * Vérifie si un objet d'erreurs ne contient aucune erreur
 * Utilisation : if (!hasErrors(errors)) { soumettre(); }
 */
export const hasErrors = (errors) => {
  return Object.values(errors).some((err) => err !== null);
};

/**
 * Formate un numéro de téléphone pour l'affichage
 * Exemple: 0345556634 → 034 55 566 34
 */
export const formatPhoneDisplay = (numtel) => {
  if (!numtel) return "";
  const cleaned = numtel.replace(/\s/g, "");
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
  }
  return cleaned;
};

// ============================================================
// Sanitizers — filtrent les caractères en temps réel
// ============================================================

/**
 * Nettoie un champ texte : supprime les caractères spéciaux
 * et les balises HTML pour éviter les injections XSS.
 * @param {string} value - La valeur brute
 * @param {object} options
 * @param {boolean} options.allowLetters - Conserver les lettres (défaut: true)
 * @param {boolean} options.allowDigits - Conserver les chiffres (défaut: true)
 * @param {boolean} options.allowSpaces - Conserver les espaces (défaut: true)
 * @param {boolean} options.allowAccents - Conserver les accents (défaut: true)
 * @param {string} options.extraChars - Caractères supplémentaires autorisés
 */
export const sanitizeText = (
  value,
  {
    allowLetters = true,
    allowDigits = true,
    allowSpaces = true,
    allowAccents = true,
    extraChars = "",
  } = {},
) => {
  if (!value) return "";
  let regex;
  let allowed = "";
  if (allowLetters) allowed += "a-zA-Z";
  if (allowDigits) allowed += "0-9";
  if (allowSpaces) allowed += "\\s";
  if (allowAccents) allowed += "À-ÿ";
  if (extraChars) {
    const escaped = extraChars.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    allowed += escaped;
  }
  regex = new RegExp(`[^${allowed}]`, "g");
  return value.replace(regex, "");
};

/**
 * Nettoie un nom : lettres, accents et espaces uniquement.
 */
export const sanitizeName = (value) => {
  return sanitizeText(value, {
    allowDigits: false,
    extraChars: "",
  });
};

/**
 * Nettoie un numéro de téléphone : chiffres uniquement.
 */
export const sanitizePhone = (value) => {
  if (!value) return "";
  return value.replace(/[^0-9]/g, "");
};

/**
 * Nettoie une raison/description : lettres, chiffres, espaces,
 * accents et ponctuation française de base.
 */
export const sanitizeRaison = (value) => {
  return sanitizeText(value, {
    extraChars: ".,-':!?;()/@&#",
  });
};

/**
 * Nettoie une valeur numérique : chiffres uniquement.
 */
export const sanitizeNumeric = (value) => {
  if (!value) return "";
  return value.replace(/[^0-9]/g, "");
};
