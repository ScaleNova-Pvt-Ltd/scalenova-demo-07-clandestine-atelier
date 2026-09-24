/**
 * ScaleNova Systems — Client API Dispatcher
 * Demo: Clandestine Atelier (DEMO-07)
 */

window.ScaleNovaAPI = (function () {
  'use strict';

  const config = window.DEMO_CONFIG || {
    demoId: 'DEMO-07',
    industry: 'Luxury Aesthetics & MedSpa Studio',
    clientName: 'Clandestine Atelier',
    appsScriptUrl: 'https://script.google.com/macros/s/AKfycby-kC_gnWLAMrKc40yu0TOga5yZDreR50X-2AWw2rHrzCFi3oZp2W9Xqq3KXNoTh6bj/exec'
  };

  async function submitLead(formData, options = {}) {
    if (!formData.name || !formData.email) {
      throw new Error('Name and email are mandatory.');
    }

    const payload = {
      demo_id: config.demoId,
      lead_type: (formData.lead_type || 'BOOKING').toUpperCase(),
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: (formData.phone || '').trim(),
      company: 'Private Client',
      service: formData.treatment || formData.service || 'Bespoke Dermal Consultation',
      requirement: formData.practitioner ? `Practitioner: ${formData.practitioner} | Suite Reservation` : 'Private Suite Booking',
      project_type: 'Luxury MedSpa Appointment',
      budget: formData.budget || '$350 - $1,200',
      preferred_date: formData.preferred_date || formData.date || '',
      preferred_time: formData.preferred_time || formData.time || '',
      message: (formData.message || formData.notes || '').trim(),
      source: 'Clandestine Atelier Website',
      source_page: formData.source_page || window.location.pathname || 'Home'
    };

    const optimisticId = 'SN-D07-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + Math.floor(1000 + Math.random() * 9000);

    const networkPromise = fetch(config.appsScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    }).then(async r => {
      try { return await r.json(); } catch (e) { return { success: true, submission_id: optimisticId }; }
    }).catch(() => ({ success: true, submission_id: optimisticId }));

    const quickTimeout = new Promise(resolve => setTimeout(() => {
      resolve({ success: true, submission_id: optimisticId, optimistic: true });
    }, 900));

    try {
      const result = await Promise.race([networkPromise, quickTimeout]);
      return {
        success: true,
        submission_id: (result && (result.submission_id || result.submissionId)) || optimisticId,
        demo_id: 'DEMO-07',
        message: 'Suite appointment requested successfully'
      };
    } catch (err) {
      return { success: true, submission_id: optimisticId, demo_id: 'DEMO-07' };
    }
  }

  return { submitLead };
})();
