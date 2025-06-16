import mockCategories from '@/services/mockData/categories.json'

class CategoryService {
  constructor() {
    this.categories = [...mockCategories]
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300))
  }

  async getAll() {
    await this.delay()
    return [...this.categories]
  }

  async getById(id) {
    await this.delay()
    const category = this.categories.find(cat => cat.Id === parseInt(id))
    return category ? { ...category } : null
  }

  async create(categoryData) {
    await this.delay()
    const newCategory = {
      Id: Math.max(...this.categories.map(c => c.Id), 0) + 1,
      ...categoryData,
      taskCount: 0
    }
    this.categories.push(newCategory)
    return { ...newCategory }
  }

  async update(id, updates) {
    await this.delay()
    const index = this.categories.findIndex(cat => cat.Id === parseInt(id))
    if (index === -1) throw new Error('Category not found')
    
    this.categories[index] = { ...this.categories[index], ...updates }
    return { ...this.categories[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.categories.findIndex(cat => cat.Id === parseInt(id))
    if (index === -1) throw new Error('Category not found')
    
    const deletedCategory = { ...this.categories[index] }
    this.categories.splice(index, 1)
    return deletedCategory
  }

  async updateTaskCount(categoryName, count) {
    await this.delay()
    const category = this.categories.find(cat => cat.name === categoryName)
    if (category) {
      category.taskCount = count
    }
    return category ? { ...category } : null
  }
}

export default new CategoryService()