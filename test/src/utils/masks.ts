function removeNumberMask(string: string | number): string {
  return String(string).replace(/\D/g, "");
}

function maskCPF(value: string): string {
  if (!value) return value;
  let mask = removeNumberMask(value);

  if (mask.length > 11) {
    mask = mask.substring(0, 11);
  }

  if (mask.length <= 11) {
    mask = mask.replace(/(\d{3})(\d)/, "$1.$2");
    mask = mask.replace(/(\d{3})(\d)/, "$1.$2");
    mask = mask.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
  return mask;
}

function maskCNPJ(value: string): string {
  if (!value) return value;
  let mask = removeNumberMask(value);

  if (mask.length > 14) {
    mask = mask.substring(0, 14);
  }
  if (mask.length <= 14) {
    mask = mask.replace(/(\d{2})(\d)/, "$1.$2");
    mask = mask.replace(/(\d{3})(\d)/, "$1.$2");
    mask = mask.replace(/(\d{3})(\d)/, "$1/$2");
    mask = mask.replace(/(\d{4})(\d{1,2})$/, "$1-$2");
  }
  return mask;
}

function maskCPFCNPJ(value: string): string {
  if (!value) return value;
  let mask = removeNumberMask(value);

  if (mask.length > 14) {
    mask = mask.substring(0, 14);
  } else if (mask.length <= 11) {
    mask = mask.substring(0, 11);
  }

  if (mask.length <= 11) {
    mask = mask.replace(/(\d{3})(\d)/, "$1.$2");
    mask = mask.replace(/(\d{3})(\d)/, "$1.$2");
    mask = mask.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  } else if (mask.length <= 14) {
    mask = mask.replace(/(\d{2})(\d)/, "$1.$2");
    mask = mask.replace(/(\d{3})(\d)/, "$1.$2");
    mask = mask.replace(/(\d{3})(\d)/, "$1/$2");
    mask = mask.replace(/(\d{4})(\d{1,2})$/, "$1-$2");
  }
  return mask;
}

export { removeNumberMask, maskCPF, maskCNPJ, maskCPFCNPJ };
