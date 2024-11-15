# Integration of Company Search System via INSEE and Gouv APIs

This documentation provides a comprehensive guide to integrating a company search module into an ERP application. This module allows users to search by company name, SIRET, or SIREN through the INSEE and Gouv APIs, and displays the relevant company information in an ERP form.

## Project Overview

This module is designed to enhance an ERP by adding a company search feature. Users can look up company details (name, SIRET, SIREN, address, creation date, employee range, etc.), which are displayed directly in the ERP form. This search functionality involves using the Gouv API to retrieve SIRENs for company names, followed by a detailed data fetch from the INSEE API.

## Module Structure

### 1. Token Management with `tokenService.js`

The `tokenService.js` file is responsible for managing authentication with the INSEE API by generating and refreshing tokens when necessary.

**How It Works**: `tokenService` ensures that a valid token is available for API requests. When no token is available, or if it's expired, the service automatically triggers a token refresh by calling an internal API endpoint in the ERP.

Example:
```javascript
// Sample usage in entrepriseService.ts
const token = await tokenService.getValidToken();
config.headers.Authorization = `Bearer ${token}`;
```

### 2. Company Search Service with `entrepriseService.ts`

This file manages all data retrieval operations related to the company search feature by interfacing with the INSEE and Gouv APIs. It includes functions to handle different search types based on user input (e.g., by name, SIRET, or SIREN).

**Search by Name**: When searching by company name, `searchEntrepriseByName` calls the Gouv API. This API only returns SIRENs associated with the company name, which are then used to perform additional INSEE API queries to fetch the full company information.

```javascript
// Example of retrieving SIRENs with a company name
const sirenList = await searchEntrepriseByTextGovApi(companyName);
```

**Search by SIRET or SIREN**: If the user searches by SIRET or SIREN, `searchEntreprise` directly queries the INSEE API to get the detailed information associated with that number.

```javascript
// Direct search example for SIRET or SIREN
const param = query.length === 9 ? `siren:${query}` : `siret:${query}`;
```

### 3. Popup Component for Search: `SearchDialog.vue`

The `SearchDialog.vue` component provides a user-friendly interface for performing company searches and selecting results to fill in the ERP form.

**Functionality**: Users choose to search by either SIRET, SIREN, or company name. The component uses `entrepriseService` to perform the search and displays the results. After the user selects a company, its details are sent to the main ERP form.

```javascript
// Call entrepriseService with user's query in SearchDialog.vue
const results = searchType.value === 'siret'
  ? await searchEntreprise(searchQuery.value)
  : await searchEntrepriseByName(searchQuery.value);
```

## Workflow for Name-Based Search

When a user performs a name-based search, the following steps are taken:

1. The component sends a search request to the Gouv API using the company name
2. The Gouv API responds with a list of SIRENs associated with that name
3. Each SIREN is then used to query the INSEE API for comprehensive company details
4. These details are formatted and displayed in the ERP form

> Note: The Gouv API only provides SIRENs; complete company information is fetched from the INSEE API using these SIRENs.

## Integration Steps into the ERP

### Step 1: Add SearchDialog.vue to the ERP Form

Incorporate `SearchDialog.vue` as a pop-up component within the ERP form:

```html
<CompanySearchDialog 
  :visible="isDialogVisible" 
  @update:visible="isDialogVisible = $event" 
  @selectCompany="updateFormData" 
/>
```

### Step 2: Link ERP Form Fields with API Data

Create an `updateFormData` function that maps the fields:

```javascript
const updateFormData = (company) => {
  formData.nomEntreprise = company.nom_complet;
  formData.numeroSiret = company.siret;
  formData.dateCreation = new Date(company.date_creation);
};
```

### Step 3: Handle Different Field Names

Modify `updateFormData` to map fields according to your ERP's naming conventions:

```javascript
const updateFormData = (company) => {
  // Example mapping from API fields to ERP form-specific fields
  formData.name = company.nom_complet; // ERP uses 'name' instead of 'nom_complet'
  formData.siret_number = company.siret; // ERP uses 'siret_number' instead of 'siret'
  formData.creation_date = company.date_creation ? new Date(company.date_creation) : null;
};
```

### Step 4: Submit Data to the ERP Backend

```javascript
const saveToBackend = () => {
  updateFormData(selectedCompany); // Populate form with company details
  submitForm(); // Submit the form data to the backend
};
```

## Best Practices for Integration

1. **Token Validity Check**: Always ensure a valid token is available for API requests using `tokenService.getValidToken()`
2. **Error Handling**: Use proper error handling for cases where the search fails (e.g., network issues, invalid entries) and display messages to inform the user
3. **Customization**: Use the `updateFormData` function to customize field mapping based on your ERP's requirements, making integration adaptable to different ERP structures
