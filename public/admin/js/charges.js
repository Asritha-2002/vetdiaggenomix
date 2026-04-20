const adminCharges = {
    async render() {
        const charges = await adminApi.getCharges();
        console.log(charges);
        const content = document.getElementById('main-content');
        content.innerHTML = this.renderChargesTable(charges);
        this.bindEvents();
    },
    renderChargesTable(charges) {
        return `
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-2xl font-bold">Additional Charges</h2>
                <button id="add-charge-btn" class="bg-blue-500 text-white px-4 py-2 rounded">
                    Add Charge
                </button>
            </div>
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Charge Type</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${charges.map(c => this.renderChargeRow(c)).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    renderChargeRow(charge) {
        return `
            <tr>
                <td class="px-6 py-4">${charge.name}</td>
                <td class="px-6 py-4 capitalize">${charge.chargeType}</td>
                <td class="px-6 py-4">${charge.type}</td>
                <td class="px-6 py-4">${charge.value}${charge.type === 'percentage' ? '%' : ''}</td>
                <td class="px-6 py-4">
                    <span class="px-2 py-1 text-xs rounded-full 
                        ${charge.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                        ${charge.isActive ? 'Active' : 'Inactive'}
                    </span>
                </td>
                <td class="px-6 py-4 flex space-x-2">
                    <button class="edit-charge text-blue-500" data-id="${charge._id}">Edit</button>
                    <button class="delete-charge text-red-500" data-id="${charge._id}">Delete</button>
                </td>
            </tr>
        `;
    },

    async showChargeForm(chargeId = null) {
        const content = document.getElementById('main-content');
        let charge = null;

        if (chargeId) {
            const charges = await adminApi.getCharges();
            charge = charges.find(c => c._id === chargeId);
        }

        content.innerHTML = `
            <div class="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <h2 class="text-2xl font-bold mb-6">${charge ? 'Edit' : 'Add'} Additional Charge</h2>
                <form id="charge-form" class="space-y-4">
                    <div>
                        <label class="block text-gray-700">Name</label>
                        <input type="text" name="name" required 
                               value="${charge?.name || ''}"
                               class="w-full border rounded px-3 py-2">
                    </div>
                    <div>
                        <label class="block text-gray-700">Charge Type</label>
                        <select name="chargeType" required class="w-full border rounded px-3 py-2">
                            <option value="delivery" ${charge?.chargeType === 'delivery' ? 'selected' : ''}>Delivery</option>
                            <option value="gst" ${charge?.chargeType === 'gst' ? 'selected' : ''}>GST</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-gray-700">Type</label>
                        <select name="type" required class="w-full border rounded px-3 py-2">
                            <option value="percentage" ${charge?.type === 'percentage' ? 'selected' : ''}>Percentage</option>
                            <option value="fixed" ${charge?.type === 'fixed' ? 'selected' : ''}>Fixed Amount</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-gray-700">Value</label>
                        <input type="number" name="value" required min="0" step="0.01"
                               value="${charge?.value || ''}"
                               class="w-full border rounded px-3 py-2">
                    </div>
                    <div id="gstSubCharges" class="space-y-2" style="display: none;">
                        <label class="block text-gray-700">GST Components</label>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label>CGST (%)</label>
                                <input type="number" name="cgst" min="0" step="0.01"
                                       value="${charge?.subCharges?.find(s => s.name === 'CGST')?.value || ''}"
                                       class="w-full border rounded px-3 py-2">
                            </div>
                            <div>
                                <label>SGST (%)</label>
                                <input type="number" name="sgst" min="0" step="0.01"
                                       value="${charge?.subCharges?.find(s => s.name === 'SGST')?.value || ''}"
                                       class="w-full border rounded px-3 py-2">
                            </div>
                            <div>
                                <label>IGST (%)</label>
                                <input type="number" name="igst" min="0" step="0.01"
                                       value="${charge?.subCharges?.find(s => s.name === 'IGST')?.value || ''}"
                                       class="w-full border rounded px-3 py-2">
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center">
                        <input type="checkbox" name="isActive" 
                               ${charge?.isActive !== false ? 'checked' : ''} 
                               class="mr-2">
                        <label class="text-gray-700">Active</label>
                    </div>
                    <div class="flex justify-end gap-2">
                        <button type="button" onclick="adminSettings.render()" 
                                class="px-4 py-2 border rounded">
                            Cancel
                        </button>
                        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">
                            ${charge ? 'Update' : 'Add'} Charge
                        </button>
                    </div>
                </form>
            </div>
        `;

        // Toggle GST subcharges visibility
        const chargeTypeSelect = document.querySelector('select[name="chargeType"]');
        const gstSubCharges = document.getElementById('gstSubCharges');
        
        const toggleGSTFields = () => {
            gstSubCharges.style.display = 
                chargeTypeSelect.value === 'gst' ? 'block' : 'none';
        };

        chargeTypeSelect.addEventListener('change', toggleGSTFields);
        toggleGSTFields();

        document.getElementById('charge-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = {
                name: formData.get('name'),
                chargeType: formData.get('chargeType'),
                type: formData.get('type'),
                value: Number(formData.get('value')),
                subCharges: [
                    { name: 'CGST', value: Number(formData.get('cgst')) || 0 },
                    { name: 'SGST', value: Number(formData.get('sgst')) || 0 },
                    { name: 'IGST', value: Number(formData.get('igst')) || 0 }
                ],
                isActive: formData.get('isActive') === 'on'
            };

            try {
                if (chargeId) {
                    await adminApi.updateCharge(chargeId, data);
                } else {
                    await adminApi.addCharge(data);
                }
                this.render();
            } catch (error) {
                alert(error.message);
            }
        });
    },

    bindEvents() {
        document.getElementById('add-charge-btn')?.addEventListener('click', () => {
            this.showChargeForm();
        });

        document.querySelectorAll('.edit-charge').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.showChargeForm(e.target.dataset.id);
            });
        });

        document.querySelectorAll('.delete-charge').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                if (confirm('Are you sure you want to delete this charge?')) {
                    try {
                        await adminApi.deleteCharge(e.target.dataset.id);
                        adminSettings.render();
                    } catch (error) {
                        alert(error.message);
                    }
                }
            });
        });
    }
};
