export default {
  canCreateUsers (currentUser) {
    if (currentUser.type === 'administrador' || currentUser.type === 'rad laudos' || currentUser.type === 'rad fisico' || currentUser.type === 'rad admin') return true
    else return false
  },

  canEdit (currentUser, user) {
    if (currentUser.email === user.email) return true
    else if (currentUser.type === 'administrador') return true
    else if ((currentUser.type === 'rad laudos' || currentUser.type === 'rad fisico' || currentUser.type === 'rad admin') && (user.type === 'cliente' || user.type === 'cliente MN')) return true
    else return false
  },

  canExclude (currentUser, user) {
    if (currentUser.type === 'administrador') return true
    else if ((currentUser.type === 'rad laudos' || currentUser.type === 'rad fisico' || currentUser.type === 'rad admin') && (user.type === 'cliente' || user.type === 'cliente MN')) return true
    else return false
  },
  canSeeCPF (currentUser) {
    if (currentUser.type === 'administrador' || currentUser.type === 'rad laudos' || currentUser.type === 'rad fisico' || currentUser.type === 'rad admin') return true
    else return false
  },

  canCreateFacility (currentUser) {
    if (currentUser.type === 'administrador' || currentUser.type === 'rad laudos' || currentUser.type === 'rad fisico' || currentUser.type === 'rad admin') return true
    else return false
  },

  canEditFacility (currentUser) {
    if (currentUser.type === 'administrador') return true
    else if (currentUser.type === 'rad laudos' || currentUser.type === 'rad fisico' || currentUser.type === 'rad admin') return true
    else return false
  },

  canExcludeFacility (currentUser) {
    if (currentUser.type === 'administrador') return true
    else if (currentUser.type === 'rad laudos' || currentUser.type === 'rad fisico' || currentUser.type === 'rad admin') return true
    else return false
  },

  canCreateDocuments (currentUser) {
    if (currentUser.type === 'administrador' || currentUser.type === 'rad laudos' || currentUser.type === 'rad fisico' || currentUser.type === 'rad admin') return true
    else return false
  },

  canExcludeDocuments (currentUser) {
    if (currentUser.type === 'administrador' || currentUser.type === 'rad laudos' || currentUser.type === 'rad fisico' || currentUser.type === 'rad admin') return true
    else return false
  },

  canSeeStorage (currentUser) {
    if (currentUser.type === 'administrador' || currentUser.type === 'rad laudos' || currentUser.type === 'rad fisico' || currentUser.type === 'rad admin') return true
    else return false
  },

  canSeeAllDocuments (currentUser) {
    if (currentUser.type === 'administrador' || currentUser.type === 'rad laudos' || currentUser.type === 'rad fisico' || currentUser.type === 'rad admin') return true
    else return false
  },

  canCreateSolidWasteManagement (currentUser) {
    if (currentUser.type === 'administrador' || currentUser.type === 'rad laudos' || currentUser.type === 'cliente MN' || currentUser.type === 'rad fisico' || currentUser.type === 'rad admin') return true
    else return false
  },

  canLiberateSolidWasteManagement (currentUser) {
    if (currentUser.type === 'administrador' || currentUser.type === 'rad laudos' || currentUser.type === 'cliente MN' || currentUser.type === 'rad fisico' || currentUser.type === 'rad admin') return true
    else return false
  },

  canExcludeSolidWasteManagement (currentUser) {
    if (currentUser.type === 'administrador' || currentUser.type === 'rad laudos' || currentUser.type === 'cliente MN' || currentUser.type === 'rad fisico' || currentUser.type === 'rad admin') return true
    else return false
  },

  canExcludeTypeOfEquipment (currentUser) {
    if (currentUser.type === 'administrador') {
      return true
    } else {
      return false
    }
  },

  canExcludeGroup (currentUser) {
    if (currentUser.type === 'administrador') {
      return true
    } else {
      return false
    }
  },

  canSeeNotLiberatedTests (currentUser) {
    if (currentUser.type === 'administrador' || currentUser.type === 'rad laudos' || currentUser.type === 'rad fisico' || currentUser.type === 'rad admin') return true
    else return false
  },

  canSeeSettingsMenu (currentUser) {
    if (currentUser.type === 'administrador' || currentUser.type === 'rad laudos' || currentUser.type === 'rad fisico' || currentUser.type === 'rad admin') return true
    else return false
  },

  canSeeWhoSigned (currentUser) {
    if (currentUser.type === 'administrador' || currentUser.type === 'rad laudos' || currentUser.type === 'rad fisico' || currentUser.type === 'rad admin') return true
    else return false
  },

  canSeeWhoLiberated (currentUser) {
    if (currentUser.type === 'administrador' || currentUser.type === 'rad laudos' || currentUser.type === 'rad fisico' || currentUser.type === 'rad admin') return true
    else return false
  },

  canSeeWhoUploaded (currentUser) {
    if (currentUser.type === 'administrador' || currentUser.type === 'rad laudos' || currentUser.type === 'rad fisico' || currentUser.type === 'rad admin') return true
    else return false
  },

  canSign (currentUser) {
    if (currentUser.type === 'administrador' || currentUser.type === 'rad fisico') return true
    else return false
  },

  canLiberate (currentUser) {
    if (currentUser.type === 'administrador' || currentUser.type === 'rad admin' || currentUser.type === 'rad fisico') return true
    else return false
  },

  canComment (currentUser) {
    if (currentUser.type === 'administrador' || currentUser.type === 'rad laudos' || currentUser.type === 'rad fisico' || currentUser.type === 'rad admin') return true
    else return false
  }
}
