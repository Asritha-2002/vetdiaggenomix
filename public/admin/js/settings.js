const adminSettings = {
    async render() {
        const content = document.getElementById('main-content');
        const [vouchers, charges] = await Promise.all([
            adminApi.getVouchers(),
            adminApi.getCharges()
        ]);

        content.innerHTML = `
            <div class="space-y-4">
                <div class="bg-white p-4 rounded-lg shadow">
                    <div class="border-b border-gray-200">
                        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
                            <button class="tab-btn border-b-2 border-transparent py-4 px-1 hover:border-gray-300
                                        ${this.activeTab === 'vouchers' ? 'border-blue-500 text-blue-600' : 'text-gray-500'}"
                                    data-tab="vouchers">
                                Vouchers
                            </button>
                            <button class="tab-btn border-b-2 border-transparent py-4 px-1 hover:border-gray-300
                                        ${this.activeTab === 'charges' ? 'border-blue-500 text-blue-600' : 'text-gray-500'}"
                                    data-tab="charges">
                                Additional Charges
                            </button>
                        </nav>
                    </div>

                    <!-- Vouchers Tab Content -->
                    <div id="vouchers-content" class="tab-content mt-4 ${this.activeTab === 'vouchers' ? '' : 'hidden'}">
                        <div class="flex justify-between items-center mb-4">
                            <h2 class="text-2xl font-bold">Vouchers</h2>
                            <button id="add-voucher-btn" class="bg-blue-500 text-white px-4 py-2 rounded">
                                Add Voucher
                            </button>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    ${vouchers.map(v => this.renderVoucherRow(v)).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Charges Tab Content -->
                    <div id="charges-content" class="tab-content mt-4 ${this.activeTab === 'charges' ? '' : 'hidden'}">
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
                    </div>
                </div>
            </div>
        `;

        this.bindEvents();
    },

    activeTab: 'vouchers',

    renderVoucherRow(voucher) {
        let valueDisplay = '';
        if (voucher.type === 'complimentary') {
            const item = voucher.complimentaryItems[0];
            valueDisplay = `Free: ${item?.quantity || 0}x ${item?.bookId?.title || 'Book'}`;
            if (item?.conditions?.minCartValue) {
                valueDisplay += ` (Min Cart: $${item.conditions.minCartValue})`;
            }
            if (item?.conditions?.requiredBookId?.title) {
                valueDisplay += `<br><small class="text-gray-500">Requires: ${item.conditions.requiredBookId.title}</small>`;
            }
        } else {
            valueDisplay = `${voucher.value}${voucher.type === 'percentage' ? '%' : ''}`;
        }

        return `
            <tr>
                <td class="px-6 py-4">${voucher.code}</td>
                <td class="px-6 py-4">${voucher.type}</td>
                <td class="px-6 py-4">${valueDisplay}</td>
                <td class="px-6 py-4">
                    <span class="px-2 py-1 text-xs rounded-full 
                        ${voucher.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                        ${voucher.isActive ? 'Active' : 'Inactive'}
                    </span>
                </td>
                <td class="px-6 py-4">
                    ${voucher.expiryDate ? new Date(voucher.expiryDate).toLocaleDateString() : 'No expiry'}
                </td>
                <td class="px-6 py-4 flex space-x-2">
                    ${voucher.type === 'complimentary' ? `
                        <button class="view-book text-green-500" 
                                onclick="adminSettings.viewBook('${voucher.complimentaryItems[0]?.bookId?._id}')">
                            See Book
                        </button>
                    ` : ''}
                    <button class="edit-voucher text-blue-500" data-id="${voucher._id}">Edit</button>
                    <button class="delete-voucher text-red-500" data-id="${voucher._id}">Delete</button>
                </td>
            </tr>
        `;
    },

    async viewBook(bookId) {
        if (!bookId) {
            alert('No book assigned');
            return;
        }
        try {
            const book = await adminApi.getBook(bookId);
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4';
            modal.innerHTML = `
                <div class="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div class="flex justify-between items-start mb-4">
                        <h2 class="text-xl font-bold">${book.title}</h2>
                        <button class="text-gray-500 hover:text-gray-700" onclick="this.closest('.fixed').remove()">
                            ×
                        </button>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <img src="${book.images[0]?.url || '/placeholder.jpg'}" 
                                 alt="${book.title}"
                                 class="w-full h-48 object-cover rounded">
                        </div>
                        <div>
                            <p><strong>Price:</strong> $${book.price}</p>
                            <p><strong>Category:</strong> ${book.category}</p>
                            <p><strong>Stock:</strong> ${book.stock}</p>
                            <p class="mt-2">${book.description}</p>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            modal.onclick = e => {
                if (e.target === modal) modal.remove();
            };
        } catch (error) {
            alert('Error loading book details');
        }
    },

    renderComplimentaryInfo(item) {
        if (!item) return 'No items';
        return `Free: ${item.quantity}x Book`;
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

    bindEvents() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.activeTab = e.target.dataset.tab;
                this.render();
            });
        });

        document.getElementById('add-voucher-btn')?.addEventListener('click', () => {
            this.showVoucherForm();
        });

        document.getElementById('add-charge-btn')?.addEventListener('click', () => {
            this.showChargeForm();
        });

        document.querySelectorAll('.edit-voucher').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.showVoucherForm(e.target.dataset.id);
            });
        });

        document.querySelectorAll('.edit-charge').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.showChargeForm(e.target.dataset.id);
            });
        });

        document.querySelectorAll('.delete-voucher').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                if (confirm('Are you sure you want to delete this voucher?')) {
                    try {
                        await adminApi.deleteVoucher(e.target.dataset.id);
                        this.render();
                    } catch (error) {
                        alert(error.message);
                    }
                }
            });
        });

        document.querySelectorAll('.delete-charge').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                if (confirm('Are you sure you want to delete this charge?')) {
                    try {
                        await adminApi.deleteCharge(e.target.dataset.id);
                        this.render();
                    } catch (error) {
                        alert(error.message);
                    }
                }
            });
        });
    },

    async showVoucherForm(voucherId = null) {
        const content = document.getElementById('main-content');
        let voucher = null;

        try {
            if (voucherId) {
                const vouchers = await adminApi.getVouchers();
                voucher = vouchers.find(v => v._id === voucherId);
            }

            content.innerHTML = `
                <div class="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
                    <h2 class="text-2xl font-bold mb-6">${voucher ? 'Edit' : 'Add'} Voucher</h2>
                    <form id="voucher-form" class="space-y-4">
                        <div>
                            <label class="block text-gray-700">Code</label>
                            <input type="text" name="code" required 
                                   value="${voucher?.code || ''}"
                                   class="w-full border rounded px-3 py-2">
                        </div>
                        <div>
                            <label class="block text-gray-700">Type</label>
                            <select name="type" required class="w-full border rounded px-3 py-2">
                                <option value="percentage" ${voucher?.type === 'percentage' ? 'selected' : ''}>Percentage</option>
                                <option value="fixed" ${voucher?.type === 'fixed' ? 'selected' : ''}>Fixed Amount</option>
                                <option value="complimentary" ${voucher?.type === 'complimentary' ? 'selected' : ''}>Complimentary Items</option>
                            </select>
                        </div>

                        <div id="valueSection" class="${voucher?.type === 'complimentary' ? 'hidden' : ''}">
                            <div>
                                <label class="block text-gray-700">Value</label>
                                <input type="number" name="value" min="0" step="0.01"
                                       value="${voucher?.value || ''}"
                                       class="w-full border rounded px-3 py-2">
                            </div>
                            <div id="maxDiscountSection" class="${voucher?.type !== 'percentage' ? 'hidden' : ''}">
                                <label class="block text-gray-700">Max Discount (leave empty for unlimited)</label>
                                <input type="number" name="maxDiscount" min="0" step="0.01"
                                       value="${voucher?.maxDiscount || ''}"
                                       class="w-full border rounded px-3 py-2">
                            </div>
                        </div>

                        <div id="complimentarySection" class="${voucher?.type !== 'complimentary' ? 'hidden' : ''} space-y-4">
                            <div>
                                <label class="block text-gray-700">Quantity</label>
                                <input type="number" name="quantity" min="1"
                                       value="${voucher?.complimentaryConfig?.quantity || 1}"
                                       class="w-full border rounded px-3 py-2">
                            </div>
                            <div>
                                <label class="block text-gray-700">Min Price</label>
                                <input type="number" name="minPrice" min="0" step="0.01"
                                       value="${voucher?.complimentaryConfig?.minPrice || 0}"
                                       class="w-full border rounded px-3 py-2">
                            </div>
                            <div>
                                <label class="block text-gray-700">Max Price</label>
                                <input type="number" name="maxPrice" min="0" step="0.01"
                                       value="${voucher?.complimentaryConfig?.maxPrice || ''}"
                                       class="w-full border rounded px-3 py-2">
                            </div>
                        </div>

                        <div>
                            <label class="block text-gray-700">Min Purchase</label>
                            <input type="number" name="minPurchase" min="0" step="0.01"
                                   value="${voucher?.minPurchase || 0}"
                                   class="w-full border rounded px-3 py-2">
                        </div>

                        <div>
                            <label class="block text-gray-700">Max Uses (leave empty for unlimited)</label>
                            <input type="number" name="maxUses" min="0"
                                   value="${voucher?.maxUses || ''}"
                                   class="w-full border rounded px-3 py-2">
                        </div>

                        <div>
                            <label class="block text-gray-700">Expiry Date</label>
                            <input type="date" name="expiryDate"
                                   value="${voucher?.expiryDate ? new Date(voucher.expiryDate).toISOString().split('T')[0] : ''}"
                                   class="w-full border rounded px-3 py-2">
                        </div>

                        <div class="flex items-center">
                            <input type="checkbox" name="isActive" 
                                   ${voucher?.isActive !== false ? 'checked' : ''} 
                                   class="mr-2">
                            <label class="text-gray-700">Active</label>
                        </div>

                        <div class="flex justify-end gap-2">
                            <button type="button" onclick="adminSettings.render()" 
                                    class="px-4 py-2 border rounded">
                                Cancel
                            </button>
                            <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">
                                ${voucher ? 'Update' : 'Add'} Voucher
                            </button>
                        </div>
                    </form>
                </div>
            `;

            const typeSelect = document.querySelector('select[name="type"]');
            const valueSection = document.getElementById('valueSection');
            const maxDiscountSection = document.getElementById('maxDiscountSection');
            const complimentarySection = document.getElementById('complimentarySection');

            typeSelect?.addEventListener('change', () => {
                const isComplimentary = typeSelect.value === 'complimentary';
                const isPercentage = typeSelect.value === 'percentage';
                valueSection.classList.toggle('hidden', isComplimentary);
                complimentarySection.classList.toggle('hidden', !isComplimentary);
                maxDiscountSection.classList.toggle('hidden', !isPercentage);
            });

            document.getElementById('voucher-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const data = {
                    code: formData.get('code'),
                    type: formData.get('type'),
                    value: formData.get('type') !== 'complimentary' ? Number(formData.get('value')) : null,
                    maxDiscount: formData.get('maxDiscount') ? Number(formData.get('maxDiscount')) : null,
                    maxUses: formData.get('maxUses') ? Number(formData.get('maxUses')) : null,
                    minPurchase: Number(formData.get('minPurchase')),
                    expiryDate: formData.get('expiryDate') || null,
                    isActive: formData.get('isActive') === 'on'
                };

                if (formData.get('type') === 'complimentary') {
                    data.complimentaryConfig = {
                        quantity: Number(formData.get('quantity')),
                        minPrice: Number(formData.get('minPrice')),
                        maxPrice: Number(formData.get('maxPrice'))
                    };
                }

                try {
                    if (voucherId) {
                        await adminApi.updateVoucher(voucherId, data);
                    } else {
                        await adminApi.addVoucher(data);
                    }
                    this.render();
                } catch (error) {
                    alert(error.message);
                }
            });
        } catch (error) {
            console.error('Error showing voucher form:', error);
            content.innerHTML = '<div class="text-red-500">Error loading form</div>';
        }
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
    }
};
